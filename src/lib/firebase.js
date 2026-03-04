import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNIisnu75mbHhQAryZyufAW6E2kGMbBxc",
  authDomain: "alex-tours-e28b6.firebaseapp.com",
  projectId: "alex-tours-e28b6",
  storageBucket: "alex-tours-e28b6.firebasestorage.app",
  messagingSenderId: "869558371540",
  appId: "1:869558371540:web:78e5b534593522821b6741"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
