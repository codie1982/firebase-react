/**
 * This represents some generic auth provider API, like Firebase.
 */
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword,isCurrentUser, updateCurrentUser} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALuReoKhzxS0E1cBWc6i9b5lOYsucGWs0",
  authDomain: "modernmusicplayer-bbc49.firebaseapp.com",
  projectId: "modernmusicplayer-bbc49",
  storageBucket: "modernmusicplayer-bbc49.appspot.com",
  messagingSenderId: "621103493987",
  appId: "1:621103493987:web:a22e9238187ae507df5956"
};

let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

const auth = getAuth(firebaseApp);

const firebaseAuthProvider = {
    isAuthenticated: false,
    signin(email,password,callback) {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("Hello : " + user.uid)
        firebaseAuthProvider.isAuthenticated = true;
        callback()
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        firebaseAuthProvider.isAuthenticated = false;
        console.log("Error : " + errorMessage)

      });
    },


    signout(callback) {
      firebaseAuthProvider.isAuthenticated = false;
      setTimeout(callback, 100);
    },
  };
  
  export { auth, firebaseApp,firebaseAuthProvider };
  // Oturum açmış kullanıcıyı kontrol etme fonksiyonu
  export const isUserLoggedIn = () => {
    return auth.currentUser !== null;
  };

  // Oturum açmış kullanıcıyı alma fonksiyonu
  export const getCurrentUser = () => {
    return auth.currentUser;
  };
  /* const Login = () => {
    const auth = getAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          console.log("Hello : " + user.uid)

          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Error : " + errorMessage)

        });
    }; */
