import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCYtsMStbko8viJ5_Tb6PeSvtvgae5hkeI",
    authDomain: "mood-tracker-5ab88.firebaseapp.com",
    projectId: "mood-tracker-5ab88",
    storageBucket: "mood-tracker-5ab88.appspot.com",
    messagingSenderId: "203051280362",
    appId: "1:203051280362:web:bafb847b92a32dc95ab493",
    measurementId: "G-RC2HSK3HYG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, signInWithPopup, db };
