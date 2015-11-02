/**
 * Created by jose on 27/10/15.
 */

var socket = io.connect('http://46.101.214.219', { 'forceNew': true });

var info, xyz = "[X, Y, Z]";
socket.on('acceleration', function(eventData){

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

});

function round(val) {
    var amt = 10;
    return Math.round(val * amt) /  amt;
}
