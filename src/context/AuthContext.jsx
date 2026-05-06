import { createContext, useState, useContext, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  useEffect(() => {
    // Dynamically update the app's CSS theme based on the active role
    if (user && user.role === 'dealership') {
      document.body.classList.add('theme-dealer');
    } else {
      document.body.classList.remove('theme-dealer');
    }
  }, [user]);

  useEffect(() => {
    // If auth is properly initialized, listen to firebase state changes
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Restore actual profile strictly from the remote database
            const docRef = doc(db, "users", firebaseUser.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
               setUser(docSnap.data());
            } else {
               // A Google User somehow signed in, but bypassing our "login" button or the popup hung
               // We build them a profile using pending role if available
               setUser(prevUser => {
                   const pendingRole = localStorage.getItem('motriva_pending_role') || (prevUser ? prevUser.role : 'individual');
                   const pendingCompany = localStorage.getItem('motriva_pending_company') || (prevUser ? prevUser.companyName : '');
                   
                   const fallbackProfile = {
                     uid: firebaseUser.uid,
                     name: firebaseUser.displayName || 'Google User',
                     email: firebaseUser.email,
                     role: pendingRole,
                     companyName: pendingCompany,
                     photo: firebaseUser.photoURL,
                     kycVerified: false,
                     documentsPending: pendingRole === 'dealership'
                   };
                   
                   // Attempt to save fallback profile if possible
                   setDoc(docRef, fallbackProfile).catch(() => {});
                   
                   localStorage.removeItem('motriva_pending_role');
                   localStorage.removeItem('motriva_pending_company');
                   return fallbackProfile;
               });
            }
          } catch (error) {
            console.error("Firestore user profile fetch failed", error);
            if (error.code === 'permission-denied' || (error.message && error.message.includes('Missing or insufficient permissions'))) {
               setUser(prevUser => {
                   const pendingRole = localStorage.getItem('motriva_pending_role') || (prevUser ? prevUser.role : 'individual');
                   const pendingCompany = localStorage.getItem('motriva_pending_company') || (prevUser ? prevUser.companyName : '');
                   const mockProfile = {
                     uid: firebaseUser.uid,
                     name: firebaseUser.displayName || 'Google User',
                     email: firebaseUser.email,
                     role: pendingRole,
                     companyName: pendingCompany,
                     photo: firebaseUser.photoURL,
                     kycVerified: false,
                     documentsPending: pendingRole === 'dealership'
                   };
                   localStorage.removeItem('motriva_pending_role');
                   localStorage.removeItem('motriva_pending_company');
                   return mockProfile;
               });
            }
          }
        } else {
          setUser(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const login = async (role, providedCompanyName = '') => {
    try {
      console.log("Attempting Google Sign-In for role:", role);
      if (!auth) {
        throw new Error("Firebase Auth is not initialized. Check your firebase.js and console settings.");
      }
      
      localStorage.setItem('motriva_pending_role', role);
      if (providedCompanyName) {
         localStorage.setItem('motriva_pending_company', providedCompanyName);
      } else {
         localStorage.removeItem('motriva_pending_company');
      }
      
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      const docRef = doc(db, "users", firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      
      let finalProfile;
      if (!docSnap.exists()) {
         finalProfile = {
           uid: firebaseUser.uid,
           name: firebaseUser.displayName || 'Google User',
           email: firebaseUser.email,
           photo: firebaseUser.photoURL,
           role: role,
           companyName: providedCompanyName,
           kycVerified: false,
           documentsPending: role === 'dealership'
         };
         
         await setDoc(docRef, finalProfile);
      } else {
         finalProfile = docSnap.data();
         
         // Update role/company if specifically logging in with a new role/name
         const updates = {};
         if (finalProfile.role !== role) updates.role = role;
         if (providedCompanyName && finalProfile.companyName !== providedCompanyName) {
            updates.companyName = providedCompanyName;
         }

         if (Object.keys(updates).length > 0) {
            await setDoc(docRef, updates, { merge: true });
            finalProfile = { ...finalProfile, ...updates };
         }
      }
      
      setUser(finalProfile);
      localStorage.removeItem('motriva_pending_role');
      localStorage.removeItem('motriva_pending_company');
      return { success: true };
    } catch (error) {
      console.error("Firebase Google Auth Error:", error.code, error.message);
      
      // If the Google Auth succeeded but Firestore blocked us, gracefully fallback to local state
      if (error.code === 'permission-denied' || (error.message && error.message.includes('Missing or insufficient permissions'))) {
         console.warn("Firestore permissions blocked saving profile. Proceeding with local profile.");
         setUser(prevUser => {
             const pendingRole = localStorage.getItem('motriva_pending_role') || (prevUser ? prevUser.role : 'individual');
             const pendingCompany = localStorage.getItem('motriva_pending_company') || (prevUser ? prevUser.companyName : '');
             const mockProfile = {
               uid: auth.currentUser?.uid || 'temp-uid',
               name: auth.currentUser?.displayName || 'Google User',
               email: auth.currentUser?.email || '',
               photo: auth.currentUser?.photoURL || '',
               role: pendingRole,
               companyName: pendingCompany,
               kycVerified: false,
               documentsPending: pendingRole === 'dealership'
             };
             localStorage.removeItem('motriva_pending_role');
             localStorage.removeItem('motriva_pending_company');
             return mockProfile;
         });
         return { success: true };
      }
      
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      if (auth && auth.app.options.apiKey !== "YOUR_API_KEY") {
        await firebaseSignOut(auth);
      }
    } catch (e) {
      console.warn("Firebase signout error", e);
    }
    setUser(null);
  };

  const updateUserProfile = async (updates) => {
    if (!user || !user.uid) return;
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, updates, { merge: true });
      setUser({ ...user, ...updates });
    } catch (error) {
      console.error("Failed to update profile to Firestore db", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile, isLoginModalOpen, openLoginModal, closeLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
