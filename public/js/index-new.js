/**
 * Created by saidatrahouchecharrouti on 25/11/15.
 */
$(function() {
    var teamSide, sideVote, token, GAMEVOTING;
    var comingFromGame = false;
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

    var socket = io.connect('http://46.101.214.219:80', { 'forceNew': true });

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
                $("#text").append("<h2>"+GAMEVOTING[teamSide + "Name"]+"</h2>");
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
        var elementAnimated = document.getElementById("textGame");
        elementAnimated.addEventListener("animationend", animationToGameListener, false);
        $("#textGame").toggleClass('none');
        $("#textIns").toggleClass('none');
        
    }
    
    function animationToGameListener(e){
        switch(e.type){
            case "animationend":
                animationShowInstructionGame();
                $("#juego").addClass('slide-2');
                myShakeEvent.start();
                addEventListener('shake', shakeEventCallback, false);
                enableSwipe();
                break;
        }
    }
    
    function animationShowInstructionGame(){
        $("#swipeArea").text(GAMEVOTING[teamSide + "InitMsg"]);
    }

    function showWait() {
        $("#initIns").append("<h2 id='textIns'>"+GAMEVOTING.waitMsg+"</h2>");
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
            if($("#option").length > 0){
                $("#option").removeClass('showArrow');    
            }
            area.html("<p id='option' >"+GAMEVOTING[msg] + "<br><br>" + GAMEVOTING.shakeMsg + "</p>");
            $("#option").addClass('showArrow');
            voted = true;
            sideVote = direction;
            comingFromGame = true;
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
        var width = window.innerWidth;
        var height = window.innerHeight;

        socket.on('winner', function(side){
            if(teamSide === side){
                $("#throphy").append("<img src = '../../images/winner.png' >");
            }else{
                $("#throphy").append("<img src = '../../images/loser.png' >");
            }
            if(supportsVibrate) { navigator.vibrate(1000); }
            socket.disconnect();
        });

        if(!comingFromGame){
            showVotedAnimation();
        }else{
            addMessageVoted();
        }
    }

    function addMessageVoted() {
        var fastTrasitionAnimation = document.getElementById("juego");
        var tweet = convertString(encodeURI(GAMEVOTING.tweet));
        if(supportsVibrate) { navigator.vibrate(1000); }
        $("#swipeArea").html("");
        $("#swipeArea").append("<div id='throphy' > </div> <div id='infoEnd'> <p id='voted' >"+GAMEVOTING.votedMsg + "<br><br>" + GAMEVOTING.thanksMsg + "<br><br>" + "</p> <a href='https://twitter.com/intent/tweet?text="+ tweet + "'>"
            +"<img src='images/tweetbutton.png' alt='Tweet this!' id='tweet'></a> </div>").addClass('showVoted');
        $("#voted").addClass('showArrow');
        fastTrasitionAnimation.removeEventListener("animationend", addMessageVoted, false);
    }

    function showVotedAnimation(){
        var fastTrasitionAnimation = document.getElementById("juego");
        fastTrasitionAnimation.addEventListener("animationend", addMessageVoted, false);
        $("#juego").addClass('goToVotedSecondSlide');
    }

    function convertString(s) {
        s = s.replace("#", "%23");
        s = s.replace("@", "%40");
        s = s.replace("'", "%27");
        return s;
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
    }
});
