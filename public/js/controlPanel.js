var socket = io.connect('http://46.101.214.219', { 'forceNew': true });
var language = "es";

function loadConfig(lang){
    language = lang;
}

function start(){
	socket.emit('start', language);
}

function reset(){
	socket.emit('reset', language);
}

