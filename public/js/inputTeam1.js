window.onload = function(){
  
  var voted = false;

  //create a new instance of shake.js.
  var myShakeEvent = new Shake({
       threshold: 15
  });

  // start listening to device motion
  myShakeEvent.start();

  // register a shake event
  window.addEventListener('shake', shakeEventDidOccur, false);

  //shake event callback
  function shakeEventDidOccur () {
    if (voted){
      navigator.vibrate(1000);
      $("#swipeArea").html("¡HAS VOTADO!<br><br>GRACIAS");
      $("#swipeArea").css('background-color', '#DD0000');
    }
  }

  var shakeMsg = "<br><br>Agita el movil en alto para votar";
 
  //Enable swiping...
  $("#swipeArea").swipe( {
  //Generic swipe handler for all directions
  swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
    if(direction == "left"){
      $(this).html("Saque a la izquierda" + shakeMsg);
      voted = true;
    }
    if(direction == "right"){
      $(this).html("Saque a la derecha" + shakeMsg);
      voted = true;
    }
            
  },
  threshold: 75       
  });
  

  function end(){
    $("#swipeArea").swipe("destroy");
    window.removeEventListener('shake', shakeEventDidOccur, false);
    myShakeEvent.stop();
  }

}