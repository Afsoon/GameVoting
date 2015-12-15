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


module.exports.handlerSocket = function(app){
    var io = socketio.listen(app);

    var COUNTDOWNDEFAULT = 90;
    var countdown = -1;
    var language;
    var GAME_STATES = ['INICIO', 'INSTRUCCIONES', 'JUEGO', 'FIN'];
    var gameState = GAME_STATES[0];

    
    setInterval(function(){
        if(countdown>0 ){
            countdown--;
            io.sockets.emit('time', countdown);
            if(countdown === 0){
                gameState = GAME_STATES[3];
                guid.cleanHashMap();
                generateUpdateJSON();
                io.sockets.emit('finishedTime', JSON.stringify(gameInstance.getGameInformationJSON()));
            }
        }
    }, 1000);


    io.on('connection', function(socket){

        socket.on('setupInstructions', function (language){
            io.sockets.emit('showInstructions', language);
            gameState = GAME_STATES[1];
        });

        socket.on('start', function (data) {
            gameState = GAME_STATES[2];
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
        });
        
        socket.on('finish', function(){
            io.sockets.emit('winner', gameInstance.getWinner());
            gameInstance = new Game(2, {'left': 0, 'right': 0});
        });
        
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
            if(gameState === GAME_STATES[2]){
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
        var isEndGame;
        if(!guid.getStatusToken(getTokenID(informationVote))){
            guid.validTokenVote(getTokenID(informationVote));
            isEndGame = !(gameState === GAME_STATES[2]);
            gameInstance.addVote(team, getSideVoted(informationVote),  isEndGame);
        }
    }

    function generateUpdateJSON(){
        io.sockets.emit('update', JSON.stringify(gameInstance.getVotesGameJSON()));
    }
    
    return io;
    
};
