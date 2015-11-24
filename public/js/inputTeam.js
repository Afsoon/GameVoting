$(function() {
  var teamSide, sideVote, token, GAMEVOTING;
  var language = navigator.language || navigator.userLanguage;
  var supportsVibrate = "vibrate" in navigator;
  var voted = false;
  var myShakeEvent = new Shake({
    threshold: 10
  });

  /* Twitter intent */
  window.twttr = (function(d, s, id) {
   var js, fjs = d.getElementsByTagName(s)[0],
   t = window.twttr || {};
   if (d.getElementById(id)) return t;
   js = d.createElement(s);
   js.id = id;
   js.src = "https://platform.twitter.com/widgets.js";
   fjs.parentNode.insertBefore(js, fjs);
   t._e = [];
   t.ready = function(f) {
     t._e.push(f);
   };
   return t;
  }(document, "script", "twitter-wjs"));

  tokenize();

  var socket = io.connect('http://46.101.214.219:9000', { 'forceNew': true });

  GAMEVOTING = {};

  setupApp();

  function tokenize() {
    if (checkToken()) {
      token = getToken();
    } else {
      token = createToken();
    }
  }

  function setupApp() {
    setLanguage();
    
    $.getJSON("../config/inputStrings_" + language + ".json", function(data){
      GAMEVOTING = data;
      socket.on('side', function(data){
        teamSide = data;
        $("h2").text(GAMEVOTING[teamSide + "Name"]);
      });
      socket.on('status', function(status){
        checkStatus(status);
      });
      socket.emit('getStatus', token);
    });
  }

  // Set English as default language if locale language not found.
  function setLanguage(){
    language = language.slice(0,2);
    if (language != "es" && language != "en") {
      language === "en";
    }
  }

  function checkToken() {
    var token = localStorage.getItem("gamevotingToken");
    if (token == undefined) {
      return false;
    } else {
      return true;
    }
  }

  function createToken() {
    var guid = createGuid();
    localStorage.setItem("gamevotingToken", guid);
    return guid;
  }

  function getToken() {
    return localStorage.getItem("gamevotingToken");
  }

  function createGuid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
  }

  function checkStatus(status) {
    switch(status) {
      case "canVote":
        initApp();
        break;

      case "cannotVote":
        showVoted();
        finish();
        break;

      case "wait":
        showWait();
        socket.on('startPlayer', function(){
          initApp();
        });
        break;
    }
  }

  function initApp() {
    $("#swipeArea").text(GAMEVOTING[teamSide + "InitMsg"]);
    myShakeEvent.start();
    addEventListener('shake', shakeEventCallback, false);
    enableSwipe();
  }
  
  function showWait() {
    $("#swipeArea").text(GAMEVOTING.waitMsg);
  }

  function enableSwipe(){
    $("#swipeArea").swipe( {
      swipe:function(event, direction) {
        evalDirection($(this), direction);
      },threshold: 75       
    });
  }

  function evalDirection(area, direction) {
    if ((direction === "left") || (direction === "right")) {
      var msgType = getMessageType();
      var msg = msgType + direction.replace(/^./, direction[0].toUpperCase());
      area.html(GAMEVOTING[msg] + "<br><br>" + GAMEVOTING.shakeMsg);
      voted = true;
      sideVote = direction;
    }
  }

  function getMessageType() {
    if (teamSide === "team1") {
      return "throwMsg";
    }
    else  {
      return "receiveMsg";
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
    $("#swipeArea").html(GAMEVOTING.votedMsg + "<br><br>" + GAMEVOTING.thanksMsg + "<br><br>");
    $("#swipeArea").css('background-color', '#DD0000');
    $("#swipeArea").append("<a href='https://twitter.com/intent/tweet?text="+ GAMEVOTING.tweet + "'>"
      +"<img src='images/tweetbutton.png' alt='Tweet this!' id='tweet'></a>")
  }

  function sendVote(){
    var json = JSON.stringify({
      "votedSide": sideVote,
      "token": token
    });
    socket.emit(teamSide, json );
    finish();
  }

  function finish(){
    window.removeEventListener('shake', shakeEventCallback, false);
    myShakeEvent.stop();    
    $("#swipeArea").swipe("destroy");
    socket.disconnect();
  }
});
