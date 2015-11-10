var socket = io.connect('http://46.101.214.219', { 'forceNew': true });
var team1left, team2left, team1right, team2right, team1votes, team2votes;

socket.emit('start');

socket.on('time', function(time){
	$("#clock").text("Quedan " + time.toString() + " segundos...");
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
    console.log("UPDATED VOTES");
});

socket.on('finish', function(){
    var team1leftPct, team1rigthPct, team2leftPct, team2rigthPct;
	var team1Side, team2Side, winner;
    var audioFemale = new Audio("../sounds/female.wav");
    var audioBell = new Audio("../sounds/bell.wav");
    
    // Calculate percentages
    if (team1votes == 0){
    	team1leftPct = 0;
    	team1rigthPct = 0;
    } else {
    	team1leftPct = (team1left / team1votes)*100;
    	team1rigthPct = (team1right / team1votes)*100;
    }

    if (team2votes == 0){
    	team2leftPct = 0;
    	team2rigthPct = 0;
    } else {
    	team2leftPct = (team2left / team2votes)*100;
    	team2rigthPct = (team2right / team2votes)*100;
    }

    audioBell.play();
    
    $(".team").fadeOut(1500);
	$("#clock").text("¡Se acabó el tiempo!").fadeIn(500);

	setTimeout(function() {
		$("#clock").text("Y el ganador es...")
		audioFemale.play();
	},4000);
	
    setTimeout(function() {

		$("#clock").fadeOut("slow");

	},8000);

    // Decide the winner
    if (Math.max(team1leftPct, team1rigthPct) === team1leftPct){
        team1Side = "left";
    } else {
        team1Side = "right";
    }

    if (Math.max(team2leftPct, team2rigthPct) === team2leftPct){
        team2Side = "left";
    } else {
        team2Side = "right";
    }

    if (team1Side === team2Side) {
        winner = "EQUIPO 2";
    } else {
        winner = "EQUIPO 1";
    }

    // DRAW case
    if (Math.max(team1leftPct, team1rigthPct) === Math.max(team2leftPct, team2rigthPct)){
        winner = "¡EMPATE!"
    }

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
		$("#team1 h3").text("Equipo 1");
    	$("#team2 h3").text("Equipo 2");
    	$("#team1, #team2 div").css("font-size", "2rem");
    	$("#team1votes")
    		.text(
      		"Izquierda: " + (Math.round(team1leftPct)).toString() +
          		"% - Derecha: " + (Math.round(team1rigthPct)).toString() + " %"
    	);
    	$("#team2votes")
    		.text(
        	"Izquierda: " + (Math.round(team2leftPct)).toString() +
        		"% - Derecha: " + (Math.round(team2rigthPct)).toString() + " %"
    	);
    	$(".team").fadeIn(1500);
	},11000);
	

});

socket.on('voted', function(){
    console.log("Alguien ha votado...");
});

socket.on('restart', function(){
    console.log("Restarting...");
    window.location.reload();
});
