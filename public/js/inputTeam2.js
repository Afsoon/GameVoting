var side; //0 for left, 1 for right
var supportsVibrate = "vibrate" in navigator

window.onload = function(){
  
  var voted = false;

  //create a new instance of shake.js.
  var myShakeEvent = new Shake({
       threshold: 5
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
      $(this).html("Recepcion a la izquierda" + shakeMsg);
      voted = true;
      side = 0;
    }
    if(direction == "right"){
      $(this).html("Recepcion a la derecha" + shakeMsg);
      voted = true;
      side = 1;
    }
  },
  threshold: 75       
  });

  function vote (){
  
    var socket = io.connect('http://46.101.214.219', { 'forceNew': true });

    if (side == 0){
          socket.emit('team2left');
        }
    else if (side == 1){
          socket.emit('team2right');
        }
    
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