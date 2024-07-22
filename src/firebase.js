// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;