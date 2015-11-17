/**
 * Created by saidatrahouchecharrouti on 12/11/15.
 */
var TeamTennis = require('./teamTennis');



function TenisGame(numberTeams, actions){
    if(!(this instanceof TenisGame)){
        return new TenisGame(numberTeams, actions);
    }
    var team;
    this.teamMap = {};
    
    for(var i = 0; i < numberTeams; i++){
        this.teamMap['team' + (i+1)] = new TeamTennis(actions);
    }
}

TenisGame.prototype.addVote  = function (team, action, timeout) {
    if(!(team in this.teamMap)){
        throw new Error('Invalid Team');
    }
    if(timeout){
        throw new Error('Timeout');
    }
    this.teamMap[team].addVote(action);  
};

TenisGame.prototype.getWinner = function () {
    var team1Action = this.teamMap['team1'].getActionMajority();
    var team2Action = this.teamMap['team2'].getActionMajority();
    
    if (team1Action === 'none' && team2Action === 'none'){
        return 'A draw';
    }else if(team2Action === team1Action || (team1Action === 'none' && team2Action !== 'none')){
        return 'Team 2';
    }else{
        return 'Team 1';
    }
    
};

TenisGame.prototype.getVotesGameJSON = function () {
    var informationJSON = {};
    for(var x in this.teamMap){
        informationJSON[x] = this.teamMap[x].getTotalVotes();
    }
    
    return informationJSON;
};

module.exports = TenisGame;