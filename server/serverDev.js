/**
 * Created by saidatrahouchecharrouti on 10/11/15.
 */
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'));


app.get('/team1', function(req, res){
    res.sendFile('inputTeam1.html', {root: __dirname + '/../public/'});
});

server.listen(8080, function(){
    console.log('Servidor iniciado');
});


io.on('connection', function(socket) {

    updateVotes();

    socket.on('team1left', function(){
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