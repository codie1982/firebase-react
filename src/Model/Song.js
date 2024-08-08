
function Song(name,url,uid,size,fileformat,type,performer,genre) {
return  {
    name,
    streamurl:url,
    userid : uid,
    performer,
    genre,
    size,
    fileformat,
    type,
    isDownloadable:true,
    isStreamable:true,
    isActive:true,
    create_date:Date.now()
    }
}

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
function Album(name,performer) {
    return  {
        name,
        performer,
        song:[],
        isActive:true,
        create_date:Date.now()
        }
    }
function Performer(name) {
    return  {
        name,
        album:[],
        isActive:true,
        create_date:Date.now()
        }
    }
    function Genre(name) {
        return  {
            name,
            song:[],
            isActive:true,
            create_date:Date.now()
            }
        }
export {Song,Playlist,Album,Performer,Genre}  ;