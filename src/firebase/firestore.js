import { doc,collection, addDoc,getDocs,updateDoc,query,orderBy,startAfter,limit} from "firebase/firestore"; 
import {auth,db} from "./firebase.js"

const SONGCOLLECTION = "Song"

export const getSongList = async (lastVisibleDoc,pageSize)=>{
    const songsRef = collection(db, SONGCOLLECTION);
    let q =  query(songsRef, orderBy("name"), startAfter(1), limit(2));
    const result = await getDocs(q);
   return result;
}

export const addSong = async (song)=>{
    try {
        const docRef = await addDoc(collection(db, SONGCOLLECTION), song);
        return docRef.id;
      } catch (e) {
        console.error("Error adding document: ", e);
        return null
      }
}

export const setSongActive = async (id,active)=>{
    try {
        var washingtonRef = db.collection(SONGCOLLECTION).doc(id);
        await updateDoc(washingtonRef, {
            active: active
          });
      } catch (e) {
        console.error("Error adding document: ", e);
        return null
      }
}