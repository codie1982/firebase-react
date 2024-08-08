function Playlist(name,description,uid) {
    return  {
        name,
        description,
        song:[],
        isActive:true,
        create_date:Date.now(),
        userid : uid,
        }
}
export {Playlist}  ;