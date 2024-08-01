// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth"
import { getStorage, ref } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALuReoKhzxS0E1cBWc6i9b5lOYsucGWs0",
  authDomain: "modernmusicplayer-bbc49.firebaseapp.com",
  projectId: "modernmusicplayer-bbc49",
  storageBucket: "modernmusicplayer-bbc49.appspot.com",
  messagingSenderId: "621103493987",
  appId: "1:621103493987:web:a22e9238187ae507df5956"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage();
export {app,auth,db,storage} 