/**
 * Created by jose on 27/10/15.
 */

//var Shake = require('shake.js'); // require shake

var supporsVibrate = "vibrate" in navigator;

var myShakeEvent = new Shake({
    threshold: 15 // optional shake strength threshold
    //timeout: 1000 // optional, determines the frequency of event generation
});

myShakeEvent.start();

window.addEventListener('shake', shakeEventDidOccur, false);

//function to call when shake occurs
function shakeEventDidOccur () {

    document.body.style.backgroundColor = "#FF2323";
    if (supporsVibrate) {
        alert('shake!');
    } else {
        navigator.vibrate(2000);
    }

}