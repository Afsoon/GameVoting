/**
 * Created by saidatrahouchecharrouti on 23/10/15.
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fs = require('fs'); // To access file system

app.use(express.static('public/'));

server.listen(80, function(){
    console.log('Servidor iniciado');
});

var campo_rojo_1 = 0;
var campo_rojo_2 = 0;
var campo_azul_1 = 0;
var campo_azul_2 = 0;
var timeout = false;
var init_countdown = true;
var limite_votos = 50;

var countdown = 100;

setInterval(function(){
    countdown--;
    io.sockets.emit('time', countdown/100);

    if(countdown == 0 || finDeVotaciones()){
        timeout = true;
        io.sockets.emit('finish');
    }
}, 1000);


io.on('connection', function(socket) {

    var valores = '{ "scoreRed": '+campo_rojo_1+',"scoreBlue":'+ campo_azul_1+' }';
    var JSON = '{ "scoreRed1": '+campo_rojo_1+',"scoreBlue1":'+ campo_azul_1+',' +
        ' "scoreRed2": '+campo_rojo_2+',"scoreBlue2":'+ campo_azul_2+' }';
    socket.emit('info', valores);

    socket.on('primeraconexion', function(){
        if(init_countdown){

        }
    });

    socket.on('red-team', function(){
        if(votoValido(hayAccionMayoritaria(campo_rojo_1, campo_rojo_2))){
            campo_rojo_1++;
        }
        io.sockets.emit('red', campo_rojo_1);
    });

    socket.on('blue-team', function () {
        if(votoValido(hayAccionMayoritaria(campo_azul_1, campo_azul_2))){
            campo_azul_1++;
        }
        io.sockets.emit('blue', campo_azul_1);
    });

    socket.on('red-team-2', function(){
        if(votoValido(hayAccionMayoritaria(campo_rojo_1, campo_rojo_2))){
            campo_rojo_2++;
        }
        io.sockets.emit('red2', campo_rojo_2);
    });

    socket.on('blue-team-2', function () {
        if(votoValido(hayAccionMayoritaria(campo_azul_1, campo_azul_2))){
            campo_azul_2++;
        }
        io.sockets.emit('blue2', campo_azul_2);
    });
    socket.on('reset', function(){
        campo_azul_1 = 0;
        campo_azul_2 = 0;
        campo_rojo_1 = 0;
        campo_rojo_2 = 0;
        countdown = 100;
        timeout = false;
        var JSON = '{ "scoreRed1": '+campo_rojo_1+',"scoreBlue1":'+ campo_azul_1+',' +
            ' "scoreRed2": '+campo_rojo_2+',"scoreBlue2":'+ campo_azul_2+' }';
        io.sockets.emit('rdata', JSON);
    });

    socket.on('sensors', function(){

    });

});

function hayAccionMayoritaria(accion1, accion2){
    return accion1 >= limite_votos || accion2 >= limite_votos;
}

function votoValido(equipo){
    return !(timeout || equipo);
}

function finDeVotaciones(){
    return hayAccionMayoritaria(campo_azul_1, campo_azul_2) && hayAccionMayoritaria(campo_rojo_1, campo_rojo_2);
}