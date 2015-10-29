/**
 * Created by jose on 27/10/15.
 */

var isGameOn = true; // Will be enabled by the admin

//var supporsVibrate = "vibrate" in navigator; // does not matter if it can vibrate


init()

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
        document.getElementById("dmEvent").innerHTML = "Tu navegador no detecta el acelerometro... :("
    }
}

function deviceMotionHandler(eventData) {
    var info, xyz = "[X, Y, Z]";
    var firstPosition = false;
    var acceleration;

    if (isGameOn) {
        while (!firstPosition){
            acceleration = eventData.accelerationIncludingGravity;        
            if ((round(acceleration.x) >= 0 && round(acceleration.x) <= 1) &&
                (round(acceleration.y) >= 9 && round(acceleration.y) <= 10) &&
                (round(acceleration.z) <= 0 && round(acceleration.z) >= -2)){
                navigator.vibrate(2000);
                alert("PRIMERA POSICION");
                firstPosition = true;
            }
        }
    }
    /* Grab the acceleration including gravity from the results. NOT USED
    var acceleration = eventData.acceleration;
    info = xyz.replace("X", round(acceleration.x));
    info = info.replace("Y", round(acceleration.y));
    info = info.replace("Z", round(acceleration.z));
    document.getElementById("moAccel").innerHTML = info; */

    //Grab the acceleration including gravity from the results...
    acceleration = eventData.accelerationIncludingGravity;
    info = xyz.replace("X", round(acceleration.x));
    info = info.replace("Y", round(acceleration.y));
    info = info.replace("Z", round(acceleration.z));
    document.getElementById("moAccelGrav").innerHTML = info;

    /* Grab the acceleration including gravity from the results. NOT USED
    var rotation = eventData.rotationRate;
    info = xyz.replace("X", round(rotation.alpha));
    info = info.replace("Y", round(rotation.beta));
    info = info.replace("Z", round(rotation.gamma));
    document.getElementById("moRotation").innerHTML = info; */

    /* info = eventData.interval; NOT USED
    document.getElementById("moInterval").innerHTML = info; */
}

function round(val) {
    var amt = 10;
    return Math.round(val * amt) /  amt;
}