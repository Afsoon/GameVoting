/**
 * Created by saidatrahouchecharrouti on 12/11/15.
 */
var TeamTennis = require('./teamTennis');
var teamMap;


function TenisGame(numberTeams, actions){
    if(!(this instanceof TenisGame)){
        return new TenisGame(numberTeams, actions);
    }
    teamMap = {};
    for(var i = 0; i < numberTeams; i++){
        teamMap['team' + (i+1)] = new TeamTennis(actions);
    }
}

TenisGame.prototype.addVote  = function (team, action) {
    if(!(team in teamMap)){
        throw new Error('Invalid Team');
    }
    console.info(teamMap);
    console.info(teamMap[team]);
    teamMap[team].addVote(action);  
};

TenisGame.prototype.getWinner = function () {
    return 'Team 1';
};

module.exports = TenisGame;