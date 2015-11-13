/**
 * Created by saidatrahouchecharrouti on 12/11/15.
 */
var matrixOption;
var game;

function TenisGame(gameInstance){
    if(!(this instanceof TenisGame)){
        return new TenisGame(gameInstance);
    }
    
    game = gameInstance;
    matrixOption = game.getMatrixGame();
}

function getTeamActionMajority(teamNumber){
    var vote = 0;
    var max = 0;
    var actions = new Array(1);
    var options = game.getNumberOptions();
    for(var j = 0; j < options; j++){
        
    }

    return votes;
}

TenisGame.prototype.getWinner = function () {
    var message;
    var numberTeams = game.getNumberTeamsPlaying();
    var votesPerTeam = 0;
    var votesWinning = 0;
    for(var i = 0; i < numberTeams; i++){
        votesPerTeam = getNumberVotesofATeam(i);
        if(votesPerTeam != votesWinning && votesPerTeam > votesWinning){
            message = 'Team ' + (i+1);
            votesWinning = votesPerTeam;
        }
    }
    return message;
};

module.exports = TenisGame;