$(function(){
    var c, d, context, ctx, maxWidth, maxHeight, intervalId, results;
    var socket = io.connect('http://46.101.214.219:9000', { 'forceNew': true });
    var language = navigator.language || navigator.userLanguage;
    var GAMEVOTING = {};
    var ball = {}, x, y, moveX, moveY;

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
            results = JSON.parse(data);
            var audioDrums = new Audio("../sounds/drums.wav");
            var audioEndingBeep = new Audio("../sounds/endingBeep.wav");

            audioEndingBeep.play();
            
            $(".countdown").fadeOut("slow");

        	setTimeout(function() {
        		$(".results").text(GAMEVOTING.winningMsg);
                $(".results").addClass("show");

        	},3500);
        	
            setTimeout(function() {
        		$(".results").css("opacity", "0");
                $(".results").removeClass("show");
                drawWinner();
                audioDrums.play();
        	},6500);
        });
    }

    function showScores() {
        var audioBell = new Audio("../sounds/bell.wav");

        audioBell.play();
        $("#cover").addClass("bye");
        $("#scoreboard").addClass("scoreboard");
        prepareCanvas();
        loadTime();
        
    }

    function prepareCanvas() {
        c = document.getElementById("courtCanvas");
        d = document.getElementById("ballCanvas");
        context = c.getContext("2d");
        ctx = d.getContext("2d");
        maxWidth = window.innerWidth;
        maxHeight = window.innerHeight;
        context.canvas.width  = maxWidth;
        context.canvas.height = maxHeight;
        ctx.canvas.width  = maxWidth;
        ctx.canvas.height = maxHeight;
        
        ball.x = maxWidth / 6;
        ball.y = maxHeight / 2;
        
        drawSky();
        drawCourt();
        drawScores();
        drawTime();
    }

    function drawSky() {
        context.beginPath();
        context.rect(0, 0, maxWidth, maxHeight);
        context.fillStyle = '#69B1C9';
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
        setTimeout(function() {
                $("#team1").addClass("enterT1");
                $("#team2").addClass("enterT2");
            }, 1210);
    }

    function drawTime() {
        $("#scoreboard aside").addClass("enterTime");
    }

    function drawWinner() {
        if (results.winner === "team1") {
            ball.moveX = 9;
            ball.moveY = 4;
            intervalId = setInterval(throwBall,1000/60);
        } else if (results.winner === "team2") {
            ball.moveX = 9;
            ball.moveY = 5;
            intervalId = setInterval(receiveBall,1200/60);
        } else {
            showWinner();
        }
    }

    function throwBall() {
        ctx.save();
        ctx.clearRect(0,0,maxWidth,maxHeight);
        ctx.beginPath();
        drawBall();

        if ( ball.y > maxHeight * 9/10){
            ball.moveY =-ball.moveY;
        }

        ball.x += ball.moveX;
        ball.y += ball.moveY;        
        ctx.restore();

        if ( ball.x > maxWidth + 100) {
            clearInterval(intervalId);
            showWinner();
        }
    }

    function receiveBall(){
        ctx.save();
        ctx.clearRect(0,0,maxWidth,maxHeight);
        drawBall();

        if ( ball.y > maxHeight * 9/10 || ball.y < (maxHeight / 2)) { 
            ball.moveY = -ball.moveY;
        }

        if ( ball.x > maxWidth * 5/6 ) {
            ball.moveX = -13;
            ball.moveY = 3;
        }

        ball.x += ball.moveX;
        ball.y += ball.moveY;        
        ctx.restore();

        if ( ball.x < -100) {
            clearInterval(intervalId);
            showWinner();
        }

    }

    function drawBall() {
        ctx.beginPath();
        ctx.fillStyle="#E8E52E";
        ctx.arc(ball.x, ball.y, 20, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#000000";
        ctx.stroke();
    }

    function loadTime() {
        var timeTotal = 0;
        var audioBeep = new Audio("../sounds/beep.wav");
        socket.on('time', function(time){
            timeTotal = Math.max(timeTotal, time);
            $(".progress").css("width", Math.round( (time / timeTotal) * 100).toString() + "%");

            if (time > 0 && time < 8) {
                audioBeep.play();
            }
            if (time == Math.round(timeTotal / 2)) {
                showToasty();
            }
        });
    }

    function updateVotes(votes) {
        var v1 = votes.team1Votes;
        var v2 = votes.team2Votes;
        var v1Old = $("#team1Votes").text();
        var v2Old = $("#team2Votes").text();
        
        $("#team1Votes").removeClass("vote");
        $("#team2Votes").removeClass("vote");
        
        if (v1 < 10) { v1 = "0" + v1;}
        if (v2 < 10) { v2 = "0" + v2;}

        $("#team1Votes").text(v1);
        if (parseInt(v1,10) > parseInt(v1Old,10)) {
            $("#team1Votes").addClass("vote");
        }
        $("#team2Votes").text(v2);
        if (parseInt(v2,10) > parseInt(v2Old,10)) {
            $("#team2Votes").addClass("vote");
        }
    }

    function showWinner(){
        var audioApplause = new Audio("../sounds/applause.wav");

        $(".results").text(GAMEVOTING[results.winner])
            .css("font-size", "7em")
            .addClass("show");

        setTimeout(function() {
            audioApplause.play();
        },1000);

        setTimeout(function(){
            showResults(results.team1Pct,
                results.team1Side,
                results.team2Pct,
                results.team2Side);
        },2000);        
    }

    function showResults(team1Pct, team1Side, team2Pct, team2Side){
        $(".teamVotes").css("font-size","2.5em")
                        .css("font-weight", "400");
        $("#team1Votes")
           .text(GAMEVOTING.chose +" "+ team1Pct + "% " + GAMEVOTING[team1Side]);
        $("#team2Votes")
           .text(GAMEVOTING.chose +" "+ team2Pct + "% " + GAMEVOTING[team2Side]);
        $(".content t1").fadeIn(1000);
        $(".content t2").fadeIn(1000);        
    }

    function showToasty() {
        var audioToasty = new Audio("../sounds/toasty.wav");        
        $(".toasty").addClass("appear");
        audioToasty.play();
    }
});
