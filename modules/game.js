/**
 * Created by saidatrahouchecharrouti on 11/11/15.
 */

var players;
var optionsMatrix;
var options;

function Game(numberOptions, playersInstance){
    if(!(this instanceof Game)){
        return new Game(numberOptions, playersInstance);
    }
    
    options = numberOptions;
    players = playersInstance;
    optionsMatrix = generateMatrix(players.getNumberTeams(), numberOptions);
    fillMatrix();
    
}

function fillMatrix(){
    var numberTeams = players.getNumberTeams();
    for(var i = 0; i < numberTeams; i++){
        for(var j = 0; j < options; j++){
            optionsMatrix[i][j] = 0;
        }
    }
}

function generateMatrix(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = generateMatrix.apply(this, args);
    }
    
    return arr;
}

function getNumberVotesofATeam(teamNumber){
    var votes = 0;
    
    for(var j = 0; j < options; j++){
        votes = votes + optionsMatrix[teamNumber][j];
    }
    
    return votes;
}

Game.prototype.getNumberOptions = function () {
    return options;  
};

Game.prototype.getNumberTeamsPlaying = function () {
    return players.getNumberTeams();   
};

Game.prototype.getTotalNumberOfVotes = function(){
    var numberTeams = players.getNumberTeams();
    var votes = 0;
    for(var i = 0; i < numberTeams; i++){
        for(var j = 0; j < options; j++){
            votes = votes + optionsMatrix[i][j];
        }
    }
    return votes;  
};

Game.prototype.getArrayMatrix = function() {
    var numberTeams = players.getNumberTeams();
    var array = new Array(numberTeams * options);
    var pos = 0;
    for(var i = 0; i < numberTeams; i++){
        for(var j = 0; j < options; j++){
            array[pos] = optionsMatrix[i][j];
            pos++;
        }
    }
    
    return array;
};

Game.prototype.addVote = function(numberTeam, numberOption){
    var numberTeams = players.getNumberTeams();
    if(numberOption < 0 || numberOption >= options){
        throw new Error('Invalid vote');
    }
    if(numberTeam < 0 || numberTeam >= numberTeams){
        throw new Error('Invalid vote');
    }
    optionsMatrix[numberTeam][numberOption] = optionsMatrix[numberTeam][numberOption] + 1;
};

Game.prototype.getWinner = function () {
    var message = 'A draw';
    var numberTeams = players.getNumberTeams();
    var votesPerTeam = 0;
    var votesWinning = 0;
    for(var i = 0; i < numberTeams; i++){
        votesPerTeam = getNumberVotesofATeam(i);
        if(votesPerTeam > votesWinning){
            message = 'Team ' + (i+1);
        }
    }
    return message;  
};

Game.prototype.getMatrixGame = function () {
  return optionsMatrix;  
};

module.exports = Game;