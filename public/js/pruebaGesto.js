var socket = io.connect('http://46.101.214.219', { 'forceNew': true });

init();
    
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
      accelerationg = eventData.accelerationIncludingGravity;
      info = xyz.replace("X", round(accelerationg.x));
      info = info.replace("Y", round(accelerationg.y));
      info = info.replace("Z", round(accelerationg.z));
      document.getElementById("moAccelGrav").innerHTML = info;

      // Grab the acceleration including gravity from the results
      var rotation = eventData.rotationRate;
      info = xyz.replace("X", round(rotation.alpha));
      info = info.replace("Y", round(rotation.beta));
      info = info.replace("Z", round(rotation.gamma));
      document.getElementById("moRotation").innerHTML = info;

      info = eventData.interval;
      document.getElementById("moInterval").innerHTML = info;

      socket.broadcast.emit('sensors', {
        accelX: round(acceleration.x),
        accelY: round(acceleration.y),
        accelZ: round(acceleration.z),
        gaccelX: round(accelerationg.x),
        gaccelY: round(accelerationg.y),
        gaccelZ: round(accelerationg.z)
      });
}

function round(val) {
      var amt = 10;
      return Math.round(val * amt) /  amt;
}