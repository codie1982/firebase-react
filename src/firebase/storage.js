import { ref,uploadBytes,uploadBytesResumable,getDownloadURL } from "firebase/storage"; 
import {storage} from "./firebase.js"



export const uploadSong =  (uploadAudio,uid,index,onProgress)=>{
  return new Promise((resolve,reject)=>{
    console.log("uploadAudio",uploadAudio)
    const storageRef = ref(storage, 'audio'+'/'+ uid+'/'+ uploadAudio.name);
    const uploadTask = uploadBytesResumable(storageRef, uploadAudio);
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(index , progress);
        //console.log('Upload is ' + progress + '% done');
        console.log("snapshot.state",snapshot.state)
        switch (snapshot.state) {
          case 'paused':
            //console.log('Upload is paused');
            break;
          case 'running':
            //console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
        reject(error);
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve({index,url:downloadURL});
        })
        .catch((error) => {
          reject(error);
        });;
      }
    );
  })
}

export const getUrl = async (uploadTask) => {
  // Upload completed successfully, now we can get the download URL
  const url = await  getDownloadURL(uploadTask.snapshot.ref) 
  return url;
}