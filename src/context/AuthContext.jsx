import { createContext, useState, useContext, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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

  const login = async (role) => {
    try {
      console.log("Attempting Google Sign-In for role:", role);
      if (!auth) {
        throw new Error("Firebase Auth is not initialized. Check your firebase.js and console settings.");
      }
      
      const provider = new GoogleAuthProvider();
      // Optional: force account selection
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      console.log("Google Auth successful:", firebaseUser.email);
      
      const docRef = doc(db, "users", firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      
      let finalProfile;
      if (!docSnap.exists()) {
         console.log("Creating new cloud profile for user...");
         finalProfile = {
           uid: firebaseUser.uid,
           name: firebaseUser.displayName || 'Google User',
           email: firebaseUser.email,
           photo: firebaseUser.photoURL,
           role: role,
           kycVerified: false,
           documentsPending: role === 'dealership'
         };
         await setDoc(docRef, finalProfile);
      } else {
         console.log("Existing user profile found in Firestore.");
         finalProfile = docSnap.data();
         // If a user returns, we respect their stored role, or update it if they specifically picked a new one
         if (finalProfile.role !== role) {
            finalProfile.role = role;
            await setDoc(docRef, { role }, { merge: true });
         }
      }
      
      setUser(finalProfile);
      return { success: true };
    } catch (error) {
      console.error("Firebase Google Auth Error:", error.code, error.message);
      
      let errorMessage = `Google Sign-In Error (${error.code}): ${error.message}`;
      
      if (error.code === 'auth/popup-blocked') {
        errorMessage = "Sign-in popup was blocked by your browser. Please allow popups for this site.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Google Sign-In is not enabled in your Firebase Console. Please enable it in Authentication -> Sign-in method.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized in your Firebase Console. Add 'localhost' to Authentication -> Settings -> Authorized domains.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      alert(errorMessage);
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
    <AuthContext.Provider value={{ user, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
