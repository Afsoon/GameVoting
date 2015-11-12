$(function() {
  var side, GAMEVOTING;
  var supportsVibrate = "vibrate" in navigator;
  var socket = io.connect('http://46.101.214.219', { 'forceNew': true });
  var voted = false;
  GAMEVOTING = {};


  var myShakeEvent = new Shake({
    threshold: 15
  });

  $.getJSON("../config/inputStrings_es.json", function(data){
    GAMEVOTING = data;
    setupApp();
  });


  function setupApp() {
      $("#swipeArea").text(GAMEVOTING.initMsg1);
      $('#loading').hide();
      $('#content').show();
      myShakeEvent.start();
      addEventListener('shake', shakeEventCallback, false);
    //Enable swiping...
    $("#swipeArea").swipe( {
      swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
        if(direction == "left"){
          $(this).html(GAMEVOTING.throwMsgLeft + "<br><br>" + GAMEVOTING.shakeMsg);
          voted = true;
          side = direction;
        } else if(direction == "right"){
          $(this).html(GAMEVOTING.throwMsgRight + "<br><br>" + GAMEVOTING.shakeMsg);
          voted = true;
          side = direction;
        }
      },threshold: 75       
    });
  }

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
      $("#swipeArea").html(GAMEVOTING.votedMsg + "<br><br>" + GAMEVOTING.thanksMsg);
      $("#swipeArea").css('background-color', '#DD0000');
      vote();   
    }
  } 
});


