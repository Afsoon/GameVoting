/**
 * Created by saidatrahouchecharrouti on 10/11/15.
 */
var express = require('express');
var app = express();
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
        if(countdown == 0){
            timeout = true;
            started = false;
            guid.cleanHashMap();
            generateUpdateJSON();
            io.sockets.emit('finishedTime', JSON.stringify(gameInstance.getGameInformationJSON()));
            console.log('enviado');
            gameInstance = new Game(2, {'left': 0, 'right': 0});
        }
    }
}, 1000);

server.listen(9000, function(){      
});

io.on('connection', function(socket){
    
    console.log('conexion establecida');

    socket.on('setupInstructions', function (language){
        io.sockets.emit('showInstructions', language); 
    });
    
    socket.on('start', function (data) {
        started = true;
        timeout = false;
        
        var informationScoreboard = getJSON(data);
        setCountdown(informationScoreboard['countdownSeconds']);
        io.sockets.emit('startScoreboard', informationScoreboard['language']);
        io.sockets.emit('startPlayer');
    });

    socket.on('team1', function (data){
        addVote(data, 'team1');
        generateUpdateJSON();
        
    });

    socket.on('team2', function (data) {
        addVote(data, 'team2');
        generateUpdateJSON();
    });
    
    socket.on('getStatus', function (data) {
        try{
            guid.addToken(data, playersInstance.addPlayer());
        }catch(err){
            console.log(err);
        }
        socket.emit('side', guid.getSide(data));
        generateStatus(data);
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
        countdown = parseInt(seconds);
    }
}

function generateStatus(tokenID, socket){
    
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

function addVote(data, team){
    var informationVote = getJSON(data);
    if(!guid.getStatusToken(getTokenID(informationVote))){
        guid.validTokenVote(getTokenID(informationVote));
        gameInstance.addVote(team, getSideVoted(informationVote), timeout);
    }
}

function generateUpdateJSON(){
    io.sockets.emit('update', JSON.stringify(gameInstance.getVotesGameJSON()));
}
