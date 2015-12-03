$(function(){
    var c, context, maxWidth, maxHeight;
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

    function initApp(){
        showScores();

        socket.on('update', function(data){
            var votes = JSON.parse(data);
            updateVotes(votes);
        });

        socket.on('finishedTime', function(data){
            var results = JSON.parse(data);
            console.log("FINISH RECIBIDO -- RESULTS: " + results);
            var audioDrums = new Audio("../sounds/drums.wav");
            var audioApplause = new Audio("../sounds/applause.wav");
            var audioEndingBeep = new Audio("../sounds/endingBeep.wav");

            audioEndingBeep.play();
            
            $(".content t1").fadeOut(2000);
            $(".content t2").fadeOut(2000);

        	setTimeout(function() {
        		$(".results").text(GAMEVOTING.winningMsg);
                $(".results").addClass("show");
        	},4000);
        	
            setTimeout(function() {
        		$(".results").css("opacity", "0");
                audioDrums.play();
                $(".results").removeClass("show");
        	},7000);

        	setTimeout(function() {
                showWinner(results.winner);
        	}, 8500);
        	
            setTimeout(function() {
        		audioApplause.play();
        	},10000);
        	
            setTimeout(function(){
                showResults(results.team1Pct,
                            results.team1Side,
                            results.team2Pct,
                            results.team2Side);
        	},11000);
        });
    }

    function showScores() {
        var audioBell = new Audio("../sounds/bell.wav");
        var audioBeep = new Audio("../sounds/beep.wav");

        audioBell.play();
        $("#cover").addClass("bye");
        $("#scoreboard").addClass("scoreboard");
        $("#scoreboard aside").addClass("enterTime");
        prepareCanvas();
        loadTime();
        
    }

    function prepareCanvas() {
        c = document.getElementById("courtCanvas");
        context = c.getContext("2d");
        maxWidth = window.innerWidth;
        maxHeight = window.innerHeight;
        context.canvas.width  = maxWidth;
        context.canvas.height = maxHeight;
        drawSky();
        drawCourt();
        drawScores();
    }

    function drawSky() {
        context.beginPath();
        context.rect(0, 0, maxWidth, maxHeight);
        context.fillStyle = '#90C3D4';
        context.fill();
        context.stroke();
    }

    function drawCourt() {
        /* Court ground */
        context.beginPath();
        context.rect(0, maxHeight/2, maxWidth, maxHeight);
        context.fillStyle = '#409141';
        context.fill();
        context.lineWidth='0';
        context.stroke();

        /* White lines */
        context.beginPath();
        context.moveTo(0, maxHeight/2);
        context.lineTo(maxWidth, maxHeight/2);
        context.lineWidth = '20';
        context.strokeStyle = 'white';
        context.stroke();

        context.beginPath();
        context.moveTo(maxWidth/2, maxHeight/2);
        context.lineTo(maxWidth/2, maxHeight);
        context.lineWidth = '20';
        context.strokeStyle = 'white';
        context.stroke();

        context.beginPath();
        context.moveTo(maxWidth/4, maxHeight/2);
        context.lineTo(maxWidth/7, maxHeight);
        context.lineWidth = '15';
        context.strokeStyle = 'white';
        context.stroke();

        context.beginPath();
        context.moveTo(maxWidth*3/4, maxHeight/2);
        context.lineTo(maxWidth*6/7, maxHeight);
        context.lineWidth = '15';
        context.strokeStyle = 'white';
        context.stroke();

        context.beginPath();
        context.moveTo(maxWidth*11/56, maxHeight*3/4);
        context.lineTo(maxWidth*45/56, maxHeight*3/4);
        context.lineWidth = '15';
        context.strokeStyle = 'white';
        context.stroke();
    }

    function drawScores() {
        $("#team1Name").text(GAMEVOTING.team1);
        $("#team2Name").text(GAMEVOTING.team2);
    }

    function loadTime() {
        var timeTotal = 0;
        socket.on('time', function(time){
            timeTotal = Math.max(timeTotal, time);
            $(".progress").css("width", Math.round( (time / timeTotal) * 100 ).toString() + "%");
            $(".progress").text(time + " seconds");
            if (time > 0 && time <8) {
                audioBeep.play();
            }
        });
    }

    function updateVotes(votes) {
        var v1 = votes.team1Votes;
        var v2 = votes.team2Votes;
        if (v1 < 10) { v1 = "0" + v1;}
        if (v2 < 10) { v2 = "0" + v2;}
        console.log("V1: " + v1 + "  - V2: " + v2);
        $("#team1Votes").text(v1);
        if (v1 > $("#team1Votes").value) {
            $("team1Votes").addClass("vote");
            $("team1Votes").removeClass("vote");
        }
        $("#team2Votes").text(v2);
        if (v1 > $("#team2Votes").value) {
            $("team2Votes").addClass("vote");
            $("team2Votes").removeClass("vote");
        }
    }

    function showWinner(winner){
        $(".results").text(GAMEVOTING[winner])
                    .css("font-size", "7em")
                    .addClass("show");
    }

    function showResults(team1Pct, team1Side, team2Pct, team2Side){
        $(".content h2").css("font-size", "3em")
                        .css("background-color", "#167003");
        $("#team1Votes")
           .text(GAMEVOTING.chose +" "+ team1Pct + "% " + GAMEVOTING[team1Side]);
        $("#team2Votes")
           .text(GAMEVOTING.chose +" "+ team2Pct + "% " + GAMEVOTING[team2Side]);
        $(".content t1").fadeIn(1000);
        $(".content t2").fadeIn(1000);        
    }
});
