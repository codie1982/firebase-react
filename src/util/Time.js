
function fixedZero(str){
    if(str.length < 2){
        return "0" + str
    }else{
        return str
    }
}
const timestampToDate = (timestamp)=> {

    // Create a new JavaScript Date object based on the timestamp
// multiplied by 1000 so that the argument is in milliseconds, not seconds
var date = new Date(timestamp)

var day = date.getDate()
var month = date.getMonth() + 1
var year = date.getFullYear()
// Hours part from the timestamp
var hours = date.getHours();

// Minutes part from the timestamp
var minutes = date.getMinutes();

// Seconds part from the timestamp
var seconds = date.getSeconds();

// Will display time in 11-12-2020 10:30:23 format
var formattedTime = fixedZero(day.toString()) + "-" + fixedZero(month.toString()) + "-"+ year.toString() + " " + fixedZero(hours.toString()) + ':' + fixedZero(minutes.toString()) + ':' + fixedZero(seconds.toString());

return formattedTime;
}



export {timestampToDate};