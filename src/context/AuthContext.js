import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
   
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth } from '.././lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

       

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDoc = doc(getFirestore(), 'users', authUser.uid);
          const unsubscribeUser = onSnapshot(userDoc, (snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.data();
              setUser({
                uid: authUser.uid,
                email: authUser.email,
                displayName: userData.displayName,
                role: userData.role,
                foodValue: userData.foodValue,
                housingValue: userData.housingValue,
              });
            } else {
              setUser(null);
            }
            setLoading(false);
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      // Make sure to also unsubscribe from Firestore listener if necessary
    };
  }, []);


  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const userEmail = credential?.idToken?.payload?.email;
      // Do something with the result, possibly update user state
      console.log(result)
      return result; // You might return the result if needed
      
    } catch (error) {
      // Handle errors if any
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };
  
  const signup = async (email, password, displayName, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(getFirestore(), 'users', user.uid), {
        email,
        displayName,
        role,
      });
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null)
    } catch (error) {
      console.error('Error logging out:', error);
    }


  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout ,signInWithGoogle }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};