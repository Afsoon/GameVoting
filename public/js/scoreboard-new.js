$(function(){

    var socket = io.connect('http://46.101.214.219:9000', { 'forceNew': true });
    var language = navigator.language || navigator.userLanguage;
    var GAMEVOTING = {};

    setupApp();

    function setupApp() {
        socket.on('showInstructions', function(lang){
            setLanguage(lang);
            var file = "../config/scoreboardStrings_" + language + ".json";
            $.getJSON(file, function(data){
                GAMEVOTING = data;
                showInstructions();
                socket.on('startScoreboard',function(data){
                    initApp();
                })
            });
        });
    }

    function setLanguage(lang) {
        language = lang;
        if ( language !== "es" && language !== "en") {
            language = "en";
        }
    }

    function showInstructions() {
        $("#subtitle").fadeOut(1000);
        $("#gameVoting").toggleClass("instructions");
        for(var i in GAMEVOTING){
            if(startsWith(i, "instruction")) {
                $("#instructions ul").append("· " + GAMEVOTING[i] + "<br><br>");        
            }
        }
        $("#instructions").toggleClass("instructions");      
    }

    function startsWith (string, prefix) {
        return string.slice(0, prefix.length) == prefix;
    }

    function showScores() {
        var timeTotal = 0;
        $("#cover").addClass("bye");
        $("#scoreboard").addClass("scoreboard");
        $("#scoreboard aside").addClass("enterTime");
        $(".content .t1 p").text(GAMEVOTING.team1Name);
        $(".content .t1 p").text(GAMEVOTING.team2Name);
        $("#team1votes").text("00");
        $("#team2votes").text("00");
        socket.on('time', function(time){
            timeTotal = Math.max(timeTotal, time);
            $(".progress").css("width", Math.round( (time / timeTotal) * 100 ).toString() + "%");
        });
    }

    function initApp(){
        showScores();

        socket.on('update', function(data){
            var votes = JSON.parse(data);
            updateVotes(votes);
        });

        socket.on('finishedTime', function(data){
            var results = JSON.parse(data);
            console.log("FINISH RECIBIDO -- RESULTS: " + results);
            var audioFemale = new Audio("../sounds/female.wav");
            var audioBell = new Audio("../sounds/bell.wav");

            audioBell.play();
            
            $(".team").fadeOut(1500);
        	$("#clock").text(GAMEVOTING.endTimeMsg).fadeIn(500);

        	setTimeout(function() {
        		$("#clock").text(GAMEVOTING.winningMsg);
        		audioFemale.play();
        	},4000);
        	
            setTimeout(function() {
        		$("#clock").fadeOut("slow");
        	},7000);

        	setTimeout(function() {
                showWinner(results.winner);
        	}, 8500);
        	
            setTimeout(function() {
        		$("#clock").slideDown(500);
        	},10000);
        	
            setTimeout(function(){
                showResults(results.team1Pct,
                            results.team1Side,
                            results.team2Pct,
                            results.team2Side);
        	},11000);
        });
    }

    function updateVotes(votes) {
        var v1 = votes.team1Votes;
        var v2 = votes.team2Votes;
        if (v1 < 10) { v1 = "0" + v1;}
        if (v2 < 10) { v2 = "0" + v2;}
        $("#team1votes").text(v1);
        $("#team2votes").text(v2);
    }

    function showWinner(winner){
        $("#clock").css("width", "90%")
                    .css("font-size", "10rem")
                    .css("background-color", "#AA0000")
                    .css("color", "#EEEEEE")
                    .text(GAMEVOTING[winner]).fadeIn(2000);
    }

    function showResults(team1Pct, team1Side, team2Pct, team2Side){
        $(".content h2").css("font-size", "3em")
                        .css("background-color", "#167003");
        $("#team1votes")
           .text(GAMEVOTING.chose +" "+ team1Pct + "% " + GAMEVOTING[team1Side]);
        $("#team2votes")
           .text(GAMEVOTING.chose +" "+ team2Pct + "% " + GAMEVOTING[team2Side]);
        
    }
});
