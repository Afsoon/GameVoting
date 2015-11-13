$(function(){

    var socket = io.connect('http://46.101.214.219', { 'forceNew': true });
    var team1left, team2left, team1right, team2right, team1votes, team2votes, message;
    var language = navigator.language || navigator.userLanguage;
    var GAMEVOTING;
    GAMEVOTING = {};

    if ( language != "es" || language != "en") {
        language = "en";
    }
    console.log(language);
    
    $.getJSON("../config/scoreboardStrings_" + language + ".json", function(data){
        GAMEVOTING = data;
        app();
    });

    function app(){
        socket.emit('start');

        $("#team1 h3").text(GAMEVOTING.votes + " " + GAMEVOTING.team1);
        $("#team2 h3").text(GAMEVOTING.votes + " " + GAMEVOTING.team2);

        socket.on('time', function(time){
        	$("#clock").text(GAMEVOTING.timeLeftMsg + time.toString() + " " + GAMEVOTING.timeUnit);
        });

        socket.on('update', function(data){
            var results = JSON.parse(data);
            team1left = results.team1left;
            team2left = results.team2left;
            team1right = results.team1right;
            team2right = results.team2right;
            team1votes = team1left + team1right;
            team2votes = team2left + team2right;
        	$("#team1votes").text( (team1votes).toString());
        	$("#team2votes").text( (team2votes).toString());
        });

        socket.on('finish', function(){
            var team1leftPct, team1rightPct, team2leftPct, team2rightPct;
        	var team1Side, team2Side, winner;
            var audioFemale = new Audio("../sounds/female.wav");
            var audioBell = new Audio("../sounds/bell.wav");
            
            // Calculate percentages
            if (team1votes == 0){
            	team1leftPct = 0;
            	team1rightPct = 0;
            } else {
            	team1leftPct = (team1left / team1votes)*100;
            	team1rightPct = (team1right / team1votes)*100;
            }

            if (team2votes == 0){
            	team2leftPct = 0;
            	team2rightPct = 0;
            } else {
            	team2leftPct = (team2left / team2votes)*100;
            	team2rightPct = (team2right / team2votes)*100;
            }

            audioBell.play();
            
            $(".team").fadeOut(1500);
        	$("#clock").text(GAMEVOTING.endTimeMsg).fadeIn(500);

        	setTimeout(function() {
        		$("#clock").text(GAMEVOTING.winningMsg);
        		audioFemale.play();
        	},4000);
        	
            setTimeout(function() {

        		$("#clock").fadeOut("slow");

        	},8000);

            // Decide the winner
            if (Math.max(team1leftPct, team1rightPct) === team1leftPct){
                team1Side = "left";
            } else {
                team1Side = "right";
            }

            if (Math.max(team2leftPct, team2rightPct) === team2leftPct){
                team2Side = "left";
            } else {
                team2Side = "right";
            }

            if (team1votes === 0) { team1Side = "none"; }
            if (team2votes === 0) { team2Side = "none"; }

            if (team1Side === team2Side || (team1Side === "none" && team2Side != "none")) {
                winner = GAMEVOTING.team2;
            } else {
                winner = GAMEVOTING.team1;
            }

            // DRAW case
            if (team1Side === "none" && team2Side === "none"){
                winner = GAMEVOTING.draw;
            }

            console.log (
                "team1leftPct: " + team1leftPct + " - " +
                "team1rightPct: " + team1rightPct + " - " +
                "team2leftPct: " + team2leftPct + " - " +
                "team2rightPct: " + team2rightPct + " - " +
                "team1Side: " + team1Side + " - " +
                "team2Side: " + team2Side
                );

        	setTimeout(function() {
            
        	$("#clock").css("width", "90%")
        					.css("font-size", "10rem")
        					.css("background-color", "#AA0000")
                            .css("color", "#EEEEEE")
        					.text(winner).fadeIn(2000)
        			.hide();
        	}, 8500);
        	
            setTimeout(function() {
        		$("#clock").slideDown(500);
        	},10000);
        	
            setTimeout(function(){
        		$("#team1 h3").text(GAMEVOTING.team1);
            	$("#team2 h3").text(GAMEVOTING.team2);
            	$("#team1, #team2 div").css("font-size", "2rem");
            	$("#team1votes")
            		.text(
              		GAMEVOTING.leftResults + (Math.round(team1leftPct * 100) / 100).toString() +
                  		"% - "+ GAMEVOTING.rightResults + (Math.round(team1rightPct * 100) / 100).toString() + " %"
            	);
            	$("#team2votes")
            		.text(
                	GAMEVOTING.leftResults + (Math.round(team2leftPct * 100) / 100).toString() +
                		"% - "+ GAMEVOTING.rightResults + (Math.round(team2rightPct * 100) / 100).toString() + " %"
            	);
            	$(".team").fadeIn(1500);
        	},11000);
        	

        });

        /*socket.on('voted', function(){
            console.log("Alguien ha votado...");
        });*/

        socket.on('restart', function(){
            console.log("Restarting...");
            window.location.reload();
        });
    }
});