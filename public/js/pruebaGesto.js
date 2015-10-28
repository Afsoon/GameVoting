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

    if (!supporsVibrate) {
        alert('Vibracion no soportada');
    } else {
        navigator.vibrate(2000);
    }

    document.body.style.backgroundColor = "#FF2323";

}