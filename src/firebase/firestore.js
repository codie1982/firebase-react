import { doc,collection, addDoc,getDocs,updateDoc,query,orderBy,startAfter,startAt,where,limit,getCountFromServer} from "firebase/firestore"; 
import {auth,db} from "./firebase.js"

const SONGCOLLECTION = "Song"
const PLAYLISTCOLLECTION = "Playlists"

export const getSongs = async (uid,limitcount)=>{
    const songsRef = collection(db, SONGCOLLECTION);
    console.log("uid,startData,limitcount,",uid,limitcount)
    let q
    q =  query(songsRef, where("userid", "==", uid),where("isActive", "==", true), orderBy("create_date"),limit(limitcount));
    const result = await getDocs(q);
   return result;
}

export const getPlaylist = async (uid)=>{
  const songsRef = collection(db, PLAYLISTCOLLECTION);
  let q
  q =  query(songsRef, where("userid", "==", uid),where("isActive", "==", true));
  const result = await getDocs(q);
 return result;
}
export const getSongCount = async ()=>{
    try {
        const collectionRef = collection(db, SONGCOLLECTION);
        const q = query(collectionRef);
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
      } catch (error) {
        console.error("Error getting document count: ", error);
        throw error;
      }
}
export const createSong = async (song)=>{
    try {
        const docRef = await addDoc(collection(db, SONGCOLLECTION), song);
        return docRef.id;
      } catch (e) {
        console.error("Error adding document: ", e);
        return null
      }
}
export const createPlaylist = async (playlist)=>{
    try {
        const docRef = await addDoc(collection(db, PLAYLISTCOLLECTION), playlist);
        return docRef.id;
      } catch (e) {
        console.error("Error adding document: ", e);
        return null
      }
}


export const addPlaylistASong = async (song,playlist_uid)=>{
    try {
        var rf = db.collection(SONGCOLLECTION).doc(song.uid);
        await updateDoc(rf, {
            playlist: [...song.playlist,playlist_uid]
          });
      } catch (e) {
        console.error("Error adding document: ", e);
        return null
      }
}

export const setSongActive = async (id,active)=>{
    try {
        var rf = db.collection(SONGCOLLECTION).doc(id);
        await updateDoc(rf, {
            active: active
          });
      } catch (e) {
        console.error("Error adding document: ", e);
        return null
      }
}