import {
     createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    signInWithPopup,
    GoogleAuthProvider, } from "firebase/auth"
import {auth} from "./firebase.js"

export const doCreateUserWithEmailandPassword = async (email,password)=>{
    return createUserWithEmailAndPassword(auth,email,password)
}

export const doSingInWithEmailandPassword = async (email,password) =>{
    return signInWithEmailAndPassword(auth,email,password);
}
export const doSingInWithGoogle = async ()=>{
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth,provider)
    return result;
}

export const doSingOut = ()=>{
    return auth.signOut();
}
export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  
  export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
  };
  
  export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
      url: `${window.location.origin}/home`,
    });
  };