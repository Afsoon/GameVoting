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
var GUIDController = require('./../modules/GUIDController');
var playersInstance = new Players(2, ['team1', 'team2']);
var gameInstance = new Game(2, {'left': 0, 'right': 0});
var guid = new GUIDController();

app.use('/', routes);

var COUNTDOWNDEFAULT = 90;
var countdown = -1;
var language;
var timeout = false;
var started = false;

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

    socket.on('setupInstruction', function (language){
       socket.emit('showInstructions', language); 
    });
    
    socket.on('start', function (data) {
        guid.cleanHashMap();
        started = true;
        var informationScoreboard = getJSON(data);
        setCountdown(informationScoreboard['countdownSeconds']);
        socket.emit('startScoreboard', informationScoreboard['language']);
        socket.emit('startPlayer');
    });

    socket.on('team1', function (data){
        var informationVote = getJSON(data);
        if(!guid.getStatusToken(getTokenID(informationVote))){
            gameInstance.addVote('team1', getSideVoted(informationVote), timeout);  
        }
        
    });


    socket.on('team2', function (data) {
        gameInstance.addVote('team2', data, timeout);
    });
    
    socket.on('getStatus', function (data) {
        generateStatus(socket);
    })
});

function getJSON(data){
    return JSON.parse(data);
}

function getTokenID(information){
    return information['token'];
}

function getSideVoted(information){
    return information['votedSide'];
}

function setCountdown(seconds){
    if(seconds === 'default'){
        countdown = COUNTDOWNDEFAULT;
    }else{
        countdown = seconds;
    }
}

function generateStatus(tokenID, socket){
    try{
        guid.addToken(tokenID);
    }catch(err){}
    socket.emit('status', getStateGame(tokenID));
}

function getStateGame(tokenID){
    if(guid.getStatusToken(tokenID)){
        return 'cannotVote';
    }else if(!guid.getStatusToken(tokenID)){
        if(started){
            return 'canVote';
        }else{
            return 'wait';
        }
    }
}

function generatePlayerJSON(){
    var informationVote = getJSON(data);
    if(!guid.getStatusToken(getTokenID(informationVote))){
        gameInstance.addVote('team1', getSideVoted(informationVote), timeout);
    }
    socket.emit('update')
}

function setLanguage(languageGame){
    language = languageGame;
}
