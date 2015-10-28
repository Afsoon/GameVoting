/**
 * Created by jose on 27/10/15.
 */

//var Shake = require('shake.js'); // require shake

var supporsVibrate = "vibrate" in navigator;

var args = {
    frequency: 50,
    /*
     How often the callback function of the
     gn.start() method is called - milliseconds
     */

    gravityNormalized: true,
    // true - if the gravity related values are to be normalized

    orientationBase: GyroNorm.GAME,
    /*
     GyroNorm.GAME for orientation values with respect to the head
     direction of the device, or GyroNorm.WORLD for orientation values
     with respect to the actual north direction of the world.
     */

    decimalCount: 1,
    // How many digits after the decimal point will there be in the return values

    logger: null,
    // Function to be called to log messages from Gyronorm.js

    screenAdjusted: true
    // If set to true it will return screen adjusted values.
};

var gn = new GyroNorm();

/*
var myShakeEvent = new Shake({
    threshold: 15 // optional shake strength threshold
    //timeout: 1000 // optional, determines the frequency of event generation
});

myShakeEvent.start();

window.addEventListener('shake', shakeEventDidOccur, false);
*/

gn.init(args).then(function(){
    gn.start(function(data){

    });
}).catch(function(e){
    // DeviceOrientation or DeviceMotion is not supported by the browser
    alert('Your browser does not support device motion!');
});

window.addEventListener("devicemotion", function(event){
    document.getElementById("ax").innerHTML= event.acceleration.x;
    document.getElementById("ay").innerHTML= event.acceleration.y;
    document.getElementById("az").innerHTML= event.acceleration.z;
    document.getElementById("agx").innerHTML= event.accelerationIncludingGravity.x
    document.getElementById("agy").innerHTML= event.accelerationIncludingGravity.y;
    document.getElementById("agz").innerHTML= event.accelerationIncludingGravity.z;
    document.getElementById("ra").innerHTML= event.rotationRate.alpha;
    document.getElementById("rb").innerHTML= event.rotationRate.beta;
    document.getElementById("rg").innerHTML =  event.rotationRate.gamma;
    //bevent.interval;
}, false);
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