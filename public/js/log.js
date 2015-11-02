var socket = io.connect('http://46.101.214.219', { 'forceNew': true });

console.log("Aplicacion iniciada...");

socket.on('started', function(){
	console.log("Conexion establecida");
})

socket.on('sensors', function(data){
	console.log(data.accelX);
});