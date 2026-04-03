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
               // A Google User somehow signed in, but bypassing our "login" button
               // We build them a fallback generic individual account and sync it
               const fallbackProfile = {
                 uid: firebaseUser.uid,
                 name: firebaseUser.displayName || 'Google User',
                 email: firebaseUser.email,
                 role: 'individual',
                 photo: firebaseUser.photoURL,
                 kycVerified: false,
                 documentsPending: false
               };
               await setDoc(docRef, fallbackProfile);
               setUser(fallbackProfile);
            }
          } catch (error) {
            console.error("Firestore user profile fetch failed", error);
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
      return { success: true };
    } catch (error) {
      console.error("Firebase Google Auth Error:", error.code, error.message);
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
