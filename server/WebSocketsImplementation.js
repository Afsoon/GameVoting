/**
 * Created by saidatrahouchecharrouti on 10/11/15.
 */
var socketio = require('socket.io');
var Game = require('./../modules/tenisgame');
var Players = require('./../modules/players');
var GUIDController = require('./../modules/GUIDController');
var playersInstance = new Players(2, ['team1', 'team2']);
var gameInstance = new Game(2);
var guid = new GUIDController();

var COUNTDOWNDEFAULT = 90;
var countdown = -1;
var language;
var timeout = false;
var started = false;

setInterval(function(){
    if(countdown>0 ){
        countdown--;
        io.sockets.emit('time', countdown);
        if(countdown === 0){
            timeout = true;
            started = false;
            guid.cleanHashMap();
            generateUpdateJSON();
            io.sockets.emit('finishedTime', JSON.stringify(gameInstance.getGameInformationJSON()));
            io.sockets.emit('winner', gameInstance.getWinner());
            gameInstance = new Game(2, {'left': 0, 'right': 0});
        }
    }
}, 1000);

module.exports.handlerSocket = function(app){
    var io = socketio.listen(app);
    

    io.on('connection', function(socket){

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
            generateStatus(data, socket);
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
        getStateGame(tokenID);
        socket.emit('status', getStateGame(tokenID) );
    }

    function getStateGame(tokenID){
        if(guid.getStatusToken(tokenID)){
            console.log('cannotVote');
            return 'cannotVote';
        }else if(!guid.getStatusToken(tokenID)){
            if(started){
                console.log('canVote');
                return 'canVote';
            }else{
                console.log('wait');
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
    
    return io;
    
};