var socket = io.connect('http://46.101.214.219', { 'forceNew': true });

function reset(){
	socket.emit('reset');
}