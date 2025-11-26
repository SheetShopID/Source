import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDzot0huXNIhvSaysihxW0rKvBoG0mTcfA",
    authDomain: "tokoinstan-3e6d5.firebaseapp.com",
    databaseURL: "https://tokoinstan-3e6d5-default-rtdb.firebaseio.com",
    projectId: "tokoinstan-3e6d5",
    storageBucket: "tokoinstan-3e6d5.firebasestorage.app",
    messagingSenderId: "403378868016",
    appId: "1:403378868016:web:60202e74a59c4a1fa842f5",
    measurementId: "G-S3GS8B4JQP"
  };

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
