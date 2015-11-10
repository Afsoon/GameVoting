var side;
var supportsVibrate = "vibrate" in navigator;
var socket = io.connect('http://46.101.214.219', { 'forceNew': true });

window.onload = function(){
  
  var voted = false;

  //create a new instance of shake.js.
  var myShakeEvent = new Shake({
       threshold: 15
  });

  // start listening to device motion
  myShakeEvent.start();

  // register a shake event
  window.addEventListener('shake', shakeEventCallback, false);

  var shakeMsg = "<br><br>Agita el movil en alto para votar"; 
 
  //Enable swiping...
  $("#swipeArea").swipe( {
  swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
    if(direction == "left"){
      $(this).html("Saque a la izquierda" + shakeMsg);
      voted = true;
      side = direction;
    }
    if(direction == "right"){
      $(this).html("Saque a la derecha" + shakeMsg);
      voted = true;
      side = direction;
    }
  },
  threshold: 75       
  });

  function vote (){
  
    // alert("SOCKET CONECTADO --> " + socket.connected);

    socket.emit('team2' + side);
        
    window.removeEventListener('shake', shakeEventCallback, false);
    myShakeEvent.stop();    
    $("#swipeArea").swipe("destroy");
    socket.disconnect();
  }

  function shakeEventCallback () {
    if (voted){
      if(supportsVibrate) {navigator.vibrate(1000);}
      $("#swipeArea").html("¡HAS VOTADO!<br><br>GRACIAS");
      $("#swipeArea").css('background-color', '#DD0000');
      vote();   
    }
  }
}
