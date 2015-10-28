/**
 * Created by jose on 27/10/15.
 */

//var Shake = require('shake.js'); // require shake

var supporsVibrate = "vibrate" in navigator;

init()

/*
var myShakeEvent = new Shake({
    threshold: 15 // optional shake strength threshold
    //timeout: 1000 // optional, determines the frequency of event generation
});

myShakeEvent.start();

window.addEventListener('shake', shakeEventDidOccur, false);
*/


//function to call when shake occurs
/*
function shakeEventDidOccur () {

    if (!supporsVibrate) {
        alert('Vibracion no soportada');
    } else {
        navigator.vibrate(2000);
    }

    document.body.style.backgroundColor = "#FF2323";

}*/

function init() {
    if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
        window.addEventListener('devicemotion', deviceMotionHandler, false);
    } else {
        document.getElementById("dmEvent").innerHTML = "Not supported on your device or browser.  Sorry."
    }
}

function deviceMotionHandler(eventData) {
    var info, xyz = "[X, Y, Z]";

    // Grab the acceleration including gravity from the results
    var acceleration = eventData.acceleration;
    info = xyz.replace("X", round(acceleration.x));
    info = info.replace("Y", round(acceleration.y));
    info = info.replace("Z", round(acceleration.z));
    document.getElementById("moAccel").innerHTML = info;

    // Grab the acceleration including gravity from the results
    acceleration = eventData.accelerationIncludingGravity;
    info = xyz.replace("X", round(acceleration.x));
    info = info.replace("Y", round(acceleration.y));
    info = info.replace("Z", round(acceleration.z));
    document.getElementById("moAccelGrav").innerHTML = info;

    // Grab the acceleration including gravity from the results
    var rotation = eventData.rotationRate;
    info = xyz.replace("X", round(rotation.alpha));
    info = info.replace("Y", round(rotation.beta));
    info = info.replace("Z", round(rotation.gamma));
    document.getElementById("moRotation").innerHTML = info;

    info = eventData.interval;
    document.getElementById("moInterval").innerHTML = info;
}

function round(val) {
    var amt = 10;
    return Math.round(val * amt) /  amt;
}