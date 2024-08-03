
function Song(name,url,uid,size,fileformat,type,performer,genre) {
return  {
    name,
    streamurl:url,
    userid : uid,
    performer,
    genre:genre,
    size,
    fileformat,
    type,
    isDownloadable:true,
    isStreamable:true,
    isActive:true,
    create_date:Date.now()
    }
}
export default Song;