import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage  } from "firebase/storage"; // Use 'getStorage' to get Firebase Storage
import { getFunctions, httpsCallable } from 'firebase/functions';

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };
const firebaseConfig = {

   apiKey: "AIzaSyDk6DiDOhaqyqPjGgMutNXbhC-niHs5oT4",
  
   authDomain: "speed-match-app-37023.firebaseapp.com",
  
   projectId: "speed-match-app-37023",
  
   storageBucket: "speed-match-app-37023.appspot.com",
  
   messagingSenderId: "816864832757",
  
   appId: "1:816864832757:web:8431a09fff32481cd7e9bc",
  
   measurementId: "G-T9W7HSPVK5"
  
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const functions = getFunctions(app);
const sendEmailToUsersCallable = httpsCallable(functions, 'sendEmailToUsers');

const auth = getAuth(app);
const storage = getStorage(app);

export { auth ,storage ,sendEmailToUsersCallable };
