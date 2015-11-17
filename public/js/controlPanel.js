var socket = io.connect('http://46.101.214.219:9000', { 'forceNew': true });
var language;

function loadConfig(lang){
    language = lang;
}

function start(){
	var seconds = $("#countdown").val();
	if (seconds==="") {seconds="default";}

	language = $("select").val();
	
	var json = {'language': language, 'countdownSeconds': seconds};
	
	console.log(json);
	socket.emit('start', json);
}