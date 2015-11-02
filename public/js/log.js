var socket = io.connect('http://46.101.214.219', { 'forceNew': true }

socket.on('sensors', function(data){
	console.log(data);
})