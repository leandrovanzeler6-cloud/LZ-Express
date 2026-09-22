import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAtSfZfeRf581MTEVeN71QosAL2CuykoII",
    authDomain: "lz-express.firebaseapp.com",
    projectId: "lz-express",
    storageBucket: "lz-express.firebasestorage.app",
    messagingSenderId: "98360564431",
    appId: "1:98360564431:web:bf753de14aee76b82c35ba",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {}, "default");
export const storage = getStorage(app);