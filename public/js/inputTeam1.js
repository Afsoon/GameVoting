$(function() {
  var teamSide, sideVote, GAMEVOTING;
  var supportsVibrate = "vibrate" in navigator;
  var socket = io.connect('http://46.101.214.219:9000', { 'forceNew': true });
  var voted = false;
  var language = navigator.language || navigator.userLanguage;
  GAMEVOTING = {};

  var myShakeEvent = new Shake({
    threshold: 15
  });

  setupApp();

  function setupApp() {
    socket.on('side', function(data){
      teamSide = data;
    })
    setLanguage();
    $.getJSON("../config/inputStrings_" + language + ".json", function(data){
      GAMEVOTING = data;
      socket.on('status', function(data){
        var status = JSON.parse(data);
        switch(checkVotable(status)){
          case "finish":
            showVoted();
            finish();
            break;

          case "vote":
            initApp();
            break;

          case "wait":
            showWait();
            break;
        }
      })
      socket.emit('getStatus');
    });
  }

  function checkVotable(status){
    var localSessionId = localStorage.getItem("sessionId");
    var voted = localStorage.getItem("voted");

    if (localSessionId === status.sessionId){
      if (voted) {
        return "finish";
      } else {
        if (status.canVote) {
          return "vote";
        } else {
          return "wait";
        }
      }
    }
    else if (localSessionId < status.sessionId || localSessionId == undefined){
      if (status.canVote) {
        return "vote";
      } else {
        return "wait";
      }
    }
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
      var throwMsg = "throwMsg" + direction.replace(/^./, direction[0].toUpperCase());
      area.html(GAMEVOTING[throwMsg] + "<br><br>" + GAMEVOTING.shakeMsg);
      voted = true;
      sideVote = direction;
    }
  }

  function shakeEventCallback() {
    if (voted){
      showVoted();  
      sendVote();   
    }
  }

  function showVoted() {
    if(supportsVibrate) { navigator.vibrate(1000); }
    $("#swipeArea").html(GAMEVOTING.votedMsg + "<br><br>" + GAMEVOTING.thanksMsg);
     $("#swipeArea").css('background-color', '#DD0000');
  }

  function showWait() {
    $("#swipeArea").html(GAMEVOTING.votedMsg + "<br><br>" + GAMEVOTING.thanksMsg);
     $("#swipeArea").css('background-color', '#DD0000');
  }

  function sendVote(){
    socket.emit('team1' + sideVote);
    localStorage.setItem("voted", true);
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


