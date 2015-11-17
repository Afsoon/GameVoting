/**
 * Created by saidatrahouchecharrouti on 10/11/15.
 */
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var routes = require('../routes/index');
var Game = require('./../modules/tenisgame');
var Players = require('./../modules/players');
var playersInstance = new Players(2, ['team1', 'team2']);
var gameInstance = new Game(2, {'left': 0, 'right': 0});

app.use('/', routes);

var COUNTDOWNDEFAULT = 90;
var countdown = -1;
var language;
var timeout = false;
var started = false;
var timestamp;

setInterval(function(){
    if(countdown>0 ){
        countdown--;
        io.sockets.emit('time', countdown);
        if(countdown == 0 || endVoting()){
            timeout = true;
            started = false;
            updateVotes();
            io.sockets.emit('finishedTime');
        }
    }
}, 1000);

server.listen(9000, function(){
    console.log("Servidor iniciado");        
});


io.on('connection', function(socket){

    socket.emit('side', playersInstance.addPlayer());
    generateSessionID();
    if(started){
        generateStatusJSON(socket);
    }
    
    
    socket.on('start', function (data) {
        started = true;
        var informationScoreboard = JSON.parse(data);
        setCountdown(informationScoreboard['countdownSeconds']);
        setLanguage(informationScoreboard['language']);
        socket.emit('startScoreboard', informationScoreboard['language']);
        socket.emit('startPlayer');
    });

    socket.on('team1', function (data){
        gameInstance.addVote('team1', data, timeout);
    });


    socket.on('team2', function (data) {
        gameInstance.addVote('team2', data, timeout);
    });
    
    socket.on('getStatus', function () {
        generateStatusJSON(socket);
    })
});

function setCountdown(seconds){
    if(seconds === 'default'){
        countdown = COUNTDOWNDEFAULT;
    }else{
        countdown = seconds;
    }
}

function generateStatusJSON(socket){
    var informationServer = {};
    informationServer['canVote'] = started;
    informationServer['sessionID'] = timestamp;
    socket.emit('status', informationServer);
}

function setLanguage(languageGame){
    language = languageGame;
}

function generateSessionID(){
    if(started){
        timestamp = Date.now();
        return timestamp;
    }
    
    if(timestamp === undefined){
        timestamp = Date.now();
        return timestamp;
    }
}