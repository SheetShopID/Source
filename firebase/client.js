import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBSJ-CWTC9TjSGL9b5hiSWRmttH-F-M2bM",
    authDomain: "ordersheetshopid.firebaseapp.com",
    databaseURL: "https://ordersheetshopid-default-rtdb.firebaseio.com",
    projectId: "ordersheetshopid",
    storageBucket: "ordersheetshopid.firebasestorage.app",
    messagingSenderId: "894838941192",
    appId: "1:894838941192:web:19008782f9bf5df25e13bd",
    measurementId: "G-5JT743CJ1V"
  };

// Cegah double initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getDatabase(app);
