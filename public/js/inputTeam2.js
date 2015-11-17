$(function() {
  var side, GAMEVOTING;
  var supportsVibrate = "vibrate" in navigator;
  var socket = io.connect('http://46.101.214.219', { 'forceNew': true });
  var voted = false;
  var language = navigator.language || navigator.userLanguage;
  GAMEVOTING = {};

  var myShakeEvent = new Shake({
    threshold: 15
  });

  setupApp();

  function setupApp() {
    setLanguage();
    $.getJSON("../config/inputStrings_" + language + ".json", function(data){
      GAMEVOTING = data;
      initApp();
    });
  }

  function initApp() {
      $("#swipeArea").text(GAMEVOTING.initMsg2);
      myShakeEvent.start();
      addEventListener('shake', shakeEventCallback, false);
      enableSwipe();
  }

  function enableSwipe(){
    $("#swipeArea").swipe( {
      swipe:function(event, direction) {
        evalDirection($(this), direction);
      },threshold: 75       
    });
  }

  function evalDirection(area, direction) {
    if ((direction === "left") || (direction === "right")){
      var receiveMsg = "receiveMsg" + direction.replace(/^./, direction[0].toUpperCase());
      area.html(GAMEVOTING[receiveMsg] + "<br><br>" + GAMEVOTING.shakeMsg);
      voted = true;
      side = direction;
    }
  }

  function shakeEventCallback() {
    if (voted){
      if(supportsVibrate) { navigator.vibrate(1000); }
      $("#swipeArea").html(GAMEVOTING.votedMsg + "<br><br>" + GAMEVOTING.thanksMsg);
      $("#swipeArea").css('background-color', '#DD0000');
      sendVote();   
    }
  }

  function sendVote(){
    socket.emit('team2' + side);
    finish();
  }

  function finish(){
    window.removeEventListener('shake', shakeEventCallback, false);
    myShakeEvent.stop();    
    $("#swipeArea").swipe("destroy");
    socket.disconnect();
  }

  function setLanguage(){
    // Set English as default language if locale language not found.
    if (language != "es" && language != "en") {
      language === "en";
    }
  }
});


