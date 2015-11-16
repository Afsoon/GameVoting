/**
 * Created by saidatrahouchecharrouti on 12/11/15.
 */
var TeamTennis = require('./teamTennis');
var teamMap = {};


function TenisGame(numberTeams, actions){
    if(!(this instanceof TenisGame)){
        return new TenisGame(numberTeams, actions);
    }
    
    for(var i = 0; i < numberTeams; i++){
        teamMap['team' + (i+1)] = new TeamTennis(actions);
    }
}

function getTeamActionMajority(team){
    if(!(team in teamMap)){
        throw new Error('Invalid Team');
    }

    return teamMap[team].getActionMajority();
}

TenisGame.prototype.addVote  = function (team, action) {
    if(!(team in teamMap)){
        throw new Error('Invalid Team');
    }
    teamMap[team].addVote(action);  
};

TenisGame.prototype.getWinner = function () {
    var message;
    var numberTeams = game.getNumberTeamsPlaying();
    var votesPerTeam = 0;
    var votesWinning = 0;
    for(var i = 0; i < numberTeams; i++){
        votesPerTeam = getTeamActionMajority(i);
        if(votesPerTeam != votesWinning && votesPerTeam > votesWinning){
            message = 'Team ' + (i+1);
            votesWinning = votesPerTeam;
        }
    }
    return message;
};

module.exports = TenisGame;