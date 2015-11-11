var side, message;
var supportsVibrate = "vibrate" in navigator;
var socket = io.connect('http://46.101.214.219', { 'forceNew': true });
var voted = false;

var myShakeEvent = new Shake({
       threshold: 15
  });
  
$.getJSON("../config/inputStrings_es.json", function(message){

  $("#swipeArea").text(message.initMsg);

  myShakeEvent.start();
  window.addEventListener('shake', shakeEventCallback, false);
   
  //Enable swiping...
  $("#swipeArea").swipe( {
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
      if(direction == "left"){
        $(this).html(message.throwMsgLeft + "<br><br>" + message.shakeMsg);
        voted = true;
        side = direction;
      } else if(direction == "right"){
        $(this).html(message.throwMsgRight + "<br><br>" + message.shakeMsg);
        voted = true;
        side = direction;
      }
    },threshold: 75       
  });

  function vote(){
    socket.emit('team1' + side);
        
    window.removeEventListener('shake', shakeEventCallback, false);
    myShakeEvent.stop();    
    $("#swipeArea").swipe("destroy");
    socket.disconnect();
  }

  function shakeEventCallback() {
    if (voted){
      if(supportsVibrate) { navigator.vibrate(1000); }
      $("#swipeArea").html(message.votedMsg + "<br><br>" + message.thanksMsg);
      $("#swipeArea").css('background-color', '#DD0000');
      vote();   
    }
  }

});



