$(function(){
    var c, d, e, context, charCtx, ballCtx, maxWidth, maxHeight, intervalId, results;
    var socket = io.connect('http://46.101.214.219:80', { 'forceNew': true });
    var GAMEVOTING = {};
    var images = {};
    var ball = {}, x, y, moveX, moveY;
    var totalResources = 12;
    var numResourcesLoaded = 0;
    var fps = 30;
    var character1X,character1Y, character2X,character2Y;
    var breathInc = 0.1;
    var breathDir = 1;
    var breathAmt = 0;
    var breathMax = 2;
    var maxEyeHeight = 30;
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
        
        assignCanvasSize(context.canvas);
        assignCanvasSize(ballCtx.canvas);
        assignCanvasSize(charCtx.canvas);

        ball.x = maxWidth * 2 / 6;
        ball.y = maxHeight / 2;

        character1X = maxWidth / 10;
        character1Y = maxHeight * 5 / 7;

        character2X = maxWidth * 8 / 10;
        character2Y = maxHeight * 5 / 7;
        
        drawSky();
        drawCourt();
        drawScores();
        drawTime();
        drawCharacters();
    }

    function assignCanvasSize (canvas) {
        canvas.width = maxWidth;
        canvas.height = maxHeight;
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
       // loadImage("hair1");

        loadImage("leftArm2");
        loadImage("legs2");
        loadImage("torso2");
        loadImage("rightArm2");
        loadImage("head2");
       // loadImage("hair2");

        loadImage("ball");
        loadImage("Cup");
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
        var x1 = character1X;
        var y1 = character1Y;
        var x2 = character2X;
        var y2 = character2Y;

        e.width = e.width; 

        charCtx.drawImage(images["legs1"], x1, y1);
        charCtx.drawImage(images["rightArm1"], x1 + 125, y1 - 195 - breathAmt);
        charCtx.drawImage(images["torso1"], x1, y1 - 150);
        charCtx.drawImage(images["leftArm1"], x1 - 50, y1 - 142 - breathAmt);
        charCtx.drawImage(images["head1"], x1 + 15, y1 - 280 - breathAmt);
        drawEye(x1 + 125, y1 - 193 - breathAmt, 20, curEyeHeight);
        drawEye(x1 + 150, y1 - 193 - breathAmt, 20, curEyeHeight);

        charCtx.drawImage(images["legs2"], x2, y2);
        charCtx.drawImage(images["rightArm2"], x2-175, y2-195 - breathAmt);
        charCtx.drawImage(images["torso2"], x2+50, y2-150);
        charCtx.drawImage(images["leftArm2"], x2+170, y2-142 - breathAmt);
        charCtx.drawImage(images["head2"], x2+35, y2-280 - breathAmt);
        drawEye(x2 + 75, y2 -193 - breathAmt, 20, curEyeHeight);
        drawEye(x2 + 100, y2 -193 - breathAmt, 20, curEyeHeight);
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
            ball.moveX = 11;
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

        if ( ball.x > ((maxWidth * 5/7) + 50)) {
            ball.moveX = -22;
            ball.moveY = 4;
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
        var audioBoo = new Audio("../sounds/boo.wav");
        images["team1"] = new Image();
        images["team2"] = new Image();

        clearInterval(intervalChars);

        $(".results").text(GAMEVOTING[results.winner])
            .css("font-size", "7em")
            .addClass("show");

        setTimeout(function() {
            if (results.winner === "draw"){
                audioBoo.play();
            } else {
                audioApplause.play();
            }
        },1000);

        socket.emit('finish');

        if (results.winner === "team1"){
            showCup();
            showEmotions("../images/character/winning1.png", "../images/character/losing2.png");
        } else if (results.winner === "team2"){
            showCup();
            showEmotions("../images/character/losing1.png", "../images/character/winning2.png");
        } else {
            curEyeHeight = 3;
            redrawChars();
        }

        setTimeout(function(){

            showResults(results.team1Pct,
                results.team1Side,
                results.team2Pct,
                results.team2Side);
        },1500);        
    }

    function showCup() {
        context.drawImage(images["Cup"], maxWidth /2 - 203, maxHeight / 2 - 364);
    }

    function showEmotions(img1, img2) {
        var team1 = new Image();
        var team2 = new Image();
        var y = maxHeight * 0.85;
        team1.src = img1;
        team2.src = img2;

        e.width = e.width;

        team1.onload = function() {
            charCtx.drawImage(team1, character1X, y - team1.height);
        }
        team2.onload = function() {
            charCtx.drawImage(team2, character2X -150, y - team2.height);
        }
    }

    function showResults(team1Pct, team1Side, team2Pct, team2Side){
        $(".teamVotes").css("font-size","2.5em")
                        .css("font-weight", "400")
                        .css("line-height", "normal");
        $("#team1Votes")
           .text(GAMEVOTING.chose +" "+ team1Pct + "% " + GAMEVOTING[team1Side]);
        $("#team2Votes")
           .text(GAMEVOTING.chose +" "+ team2Pct + "% " + GAMEVOTING[team2Side]);
        $(".content t1").fadeIn(1000);
        $(".content t2").fadeIn(1000);        
    }

    function showToasty() {
        // Dedicado a Israel por su paciencia 
        var audioToasty = new Audio("../sounds/toasty.wav");        
        $(".toasty").addClass("appear");
        audioToasty.play();
    }
});
