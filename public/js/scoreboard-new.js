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
        $("#team1 h3").text(GAMEVOTING.votes + " " + GAMEVOTING.team1);
        $("#team2 h3").text(GAMEVOTING.votes + " " + GAMEVOTING.team2);
        $("#team1votes").text("0");
        $("#team2votes").text("0");
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
        $("#team1votes").text(votes.team1Votes);
        $("#team2votes").text(votes.team2Votes);
    }

    function showWinner(winner){
        $("#clock").css("width", "90%")
                    .css("font-size", "10rem")
                    .css("background-color", "#AA0000")
                    .css("color", "#EEEEEE")
                    .text(GAMEVOTING[winner]).fadeIn(2000);
    }

    function showResults(team1Pct, team1Side, team2Pct, team2Side){
        $("#team1 h3").text(GAMEVOTING.team1);
        $("#team2 h3").text(GAMEVOTING.team2);
        $("#team1, #team2 div").css("font-size", "2rem");
        $("#team1votes")
           .text(GAMEVOTING.chose +" "+ team1Pct + "% " + GAMEVOTING[team1Side]);
        $("#team2votes")
           .text(GAMEVOTING.chose +" "+ team2Pct + "% " + GAMEVOTING[team2Side]);
        $(".team").fadeIn(1500);
    }
});
