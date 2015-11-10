/**
 * Created by saidatrahouchecharrouti on 23/10/15.
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public/'));

server.listen(80, function(){
    console.log('Servidor iniciado');
});

var COUNTDOWN_SECONDS = 100;

var team1left = 0;
var team1right = 0;
var team2left = 0;
var team2right = 0;
var timeout = false;
var init_countdown = true;
var votesLimit = 50;
var countdown = COUNTDOWN_SECONDS;

setInterval(function(){
    if(countdown>0){
        countdown--;
        io.sockets.emit('time', countdown);
        if(countdown == 0 || endVoting()){
            timeout = true;
            updateVotes();
            io.sockets.emit('finish');
        }
    }
}, 1000);


io.on('connection', function(socket) {

    updateVotes();

    socket.on('team1left', function(){
        console.log("VOTED");
        if(isValid(isEndingAction(team1left, team1right))){
            team1left++;
        }
        updateVotes();
    });

    socket.on('team1right', function () {
        if(isValid(isEndingAction(team2left, team2right))){
            team1right++;
        }
        updateVotes();
    });

    socket.on('team2left', function(){
        if(isValid(isEndingAction(team1left, team1right))){
            team2left++;
        }
        updateVotes();
    });

    socket.on('team2right', function () {
        if(isValid(isEndingAction(team2left, team2right))){
            team2right++;
        }
        updateVotes();
    });

    socket.on('reset', function(){
        team2left = 0;
        team2right = 0;
        team1left = 0;
        team1right = 0;
        countdown = COUNTDOWN_SECONDS;
        timeout = false;
        updateVotes();
    });

});

function updateVotes(){
    var JSON = '{"team1left": '+ team1left +', "team1right":'+ team1right+', "team2left": '+ team2left +', "team2right":'+ team2right+' }';  
    io.sockets.emit('update', JSON);
}
function isEndingAction(accion1, accion2){
    return accion1 >= votesLimit || accion2 >= votesLimit;
}

function isValid(team){
    return !(timeout || team);
}

function endVoting(){
    return isEndingAction(team2left, team2right) && isEndingAction(team1left, team1right);
}