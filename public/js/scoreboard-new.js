$(function(){
    var c, d, e, context, charCtx, ballCtx, maxWidth, maxHeight, intervalId, results;
    var socket = io.connect('http://46.101.214.219:9000', { 'forceNew': true });
    var GAMEVOTING = {};
    var images = {};
    var ball = {}, x, y, moveX, moveY;
    var totalResources = 6;
    var numResourcesLoaded = 0;
    var fps = 30;
    var character1X,character1Y;
    var breathInc = 0.1;
    var breathDir = 1;
    var breathAmt = 0;
    var breathMax = 2;
    var maxEyeHeight = 20;
    var curEyeHeight = maxEyeHeight;
    var eyeOpenTime = 0;
    var timeBtwBlinks = 4000;
    var blinkUpdateTime = 200;
    var intervalChars;
    
    setupApp();

    function setupApp() {
        var language = navigator.language || navigator.userLanguage;
        socket.on('showInstructions', function(lang){
            language = setLanguage(lang);
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
        var language = lang;
        if ( language !== "es" && language !== "en") {
            language = "en";
        }
        return language;
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
        e = document.getElementById("charCanvas");
        context = c.getContext("2d");
        ballCtx = d.getContext("2d");
        charCtx = e.getContext("2d");
        maxWidth = window.innerWidth;
        maxHeight = window.innerHeight;
        context.canvas.width  = maxWidth;
        context.canvas.height = maxHeight;
        ballCtx.canvas.width  = maxWidth;
        ballCtx.canvas.height = maxHeight;
        charCtx.canvas.width  = maxWidth;
        charCtx.canvas.height = maxHeight;

        ball.x = maxWidth / 6;
        ball.y = maxHeight / 2;

        character1X = maxWidth / 10;
        character1Y = maxHeight * 5 / 7;
        
        drawSky();
        drawCourt();
        drawScores();
        drawTime();
        drawCharacters();
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
        drawLine(0, maxHeight/2, maxWidth, maxHeight/2, '20', 'white');
        drawLine(maxWidth/2, maxHeight/2, maxWidth/2, maxHeight, '20', 'white');
        drawLine(maxWidth/4, maxHeight/2, maxWidth/7, maxHeight, '15', 'white');
        drawLine(maxWidth*3/4, maxHeight/2, maxWidth*6/7, maxHeight, '15', 'white');
        drawLine(maxWidth*11/56, maxHeight*3/4, maxWidth*45/56, maxHeight*3/4, '15', 'white');
    }

    function drawLine(iniX, iniY, endX, endY, thickness, color){
        context.beginPath();
        context.moveTo(iniX, iniY);
        context.lineTo(endX, endY);
        context.lineWidth = thickness;
        context.strokeStyle = color;
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

    function drawCharacters() {
        loadImage("leftArm1");
        loadImage("legs1");
        loadImage("torso1");
        loadImage("rightArm1");
        loadImage("head1");
        loadImage("hair");

        loadImage("ball");
    }

    function loadImage(file) {
        images[file] = new Image();
        images[file].onload = function() {
            resourcesLoaded();
        }
        images[file].src = "../images/character/" + file + ".png";
    }

    function resourcesLoaded() {
        numResourcesLoaded += 1;
        if (numResourcesLoaded === totalResources) {
            intervalChars = setInterval(redrawChars, 1000 / fps);
            setInterval(updateBreath, 1000 / fps);
        }
    }

    function redrawChars() {
        var x = character1X;
        var y = character1Y;

        e.width = e.width; 

        charCtx.drawImage(images["legs1"], x, y);
        charCtx.drawImage(images["rightArm1"], x+125, y-195 - breathAmt);
        charCtx.drawImage(images["torso1"], x, y-150);
        charCtx.drawImage(images["leftArm1"], x-50, y-142 - breathAmt);
        charCtx.drawImage(images["head1"], x+15, y-280 - breathAmt);
        //charCtx.drawImage(images["hair"], x-37, y-138- breathAmt);
        drawEye(x+125, y-188- breathAmt, 15, curEyeHeight);
        drawEye(x+140, y-188- breathAmt, 15, curEyeHeight);
        //drawEye(x+40, y+29, 160 - breathAmt, 6); // drawShadow
    }

    function drawEye(centerX, centerY, width, height){
        charCtx.beginPath();

        charCtx.moveTo(centerX, centerY - height/2);

        charCtx.bezierCurveTo(
            centerX + width / 2, centerY - height / 2,
            centerX + width / 2, centerY + height / 2,
            centerX, centerY + height / 2);

        charCtx.bezierCurveTo(
            centerX - width / 2, centerY + height / 2,
            centerX - width / 2, centerY - height / 2,
            centerX, centerY - height / 2);

        charCtx.fillStyle = "black";
        charCtx.fill();
        charCtx.closePath;
    }

    function updateBreath() {
        if (breathDir === 1) {  // breath in
            breathAmt -= breathInc;
            if (breathAmt < -breathMax) {
              breathDir = -1;
            }
        } else {  // breath out
            breathAmt += breathInc;
            if(breathAmt > breathMax) {
              breathDir = 1;
            }
        }
    }

    function updateBlink() { 
        curEyeHeight -= 1;
        if (curEyeHeight <= 0) {
            eyeOpenTime = 0;
            curEyeHeight = maxEyeHeight;
         } else {
            setTimeout(updateBlink, 10);
         }  
    }
    
    function drawWinner() {
        if (results.winner === "team1") {
            ball.moveX = 12;
            ball.moveY = 4;
            intervalId = setInterval(throwBall,1000/fps);
        } else if (results.winner === "team2") {
            ball.moveX = 12;
            ball.moveY = 5;
            intervalId = setInterval(receiveBall,1200/fps);
        } else {
            showWinner();
        }
    }

    function throwBall() {
        ballCtx.save();
        ballCtx.clearRect(0,0,maxWidth,maxHeight);
        drawBall(ball.x, ball.y);

        if ( ball.y > maxHeight * 7/10){
            ball.moveY =-ball.moveY;
        }

        ball.x += ball.moveX;
        ball.y += ball.moveY;        
        ballCtx.restore();

        if ( ball.x > maxWidth + 100) {
            clearInterval(intervalId);
            showWinner();
        }
    }

    function receiveBall(){
        ballCtx.save();
        ballCtx.clearRect(0,0,maxWidth,maxHeight);
        drawBall(ball.x, ball.y);

        if ( ball.y > maxHeight * 7/10 || ball.y < (maxHeight / 2)) { 
            ball.moveY = -ball.moveY;
        }

        if ( ball.x > maxWidth * 5/6 ) {
            ball.moveX = -13;
            ball.moveY = 3;
        }

        ball.x += ball.moveX;
        ball.y += ball.moveY;        
        ballCtx.restore();

        if ( ball.x < -100) {
            clearInterval(intervalId);
            showWinner();
        }
    }

    function drawBall(x, y) {
        ballCtx.drawImage(images["ball"], x, y);
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

        updateBlink();
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
