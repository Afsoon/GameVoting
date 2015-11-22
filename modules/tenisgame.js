/**
 * Created by saidatrahouchecharrouti on 12/11/15.
 */
'use strict'; 
var TeamTennis = require('./teamTennis');



function TenisGame(numberTeams, actions){
    if(!(this instanceof TenisGame)){
        return new TenisGame(numberTeams, actions);
    }
    this.teamMap = {};
    for(var i = 0; i < numberTeams; i++){
        this.teamMap['team' + (i+1)] = new TeamTennis(JSON.parse(JSON.stringify(actions)));
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
        return 'draw';
    }else if(team2Action === team1Action || (team1Action === 'none' && team2Action !== 'none')){
        return 'team2';
    }else{
        return 'team1';
    }
    
};

TenisGame.prototype.getVotesGameJSON = function () {
    var votesInformationJSON = {};
    for(var x in this.teamMap){
        if(this.teamMap.hasOwnProperty(x)){
            votesInformationJSON[x+'Votes'] = this.teamMap[x].getTotalVotes();
        }
    }
    return votesInformationJSON;
};

TenisGame.prototype.getGameInformationJSON = function () {
    var gameInformationJSON = {};
    gameInformationJSON['winner'] = this.getWinner();
    for(var x in this.teamMap){
        if(this.teamMap.hasOwnProperty(x)){
            gameInformationJSON[x+'Side'] = this.teamMap[x].getActionMajority();
            gameInformationJSON[x+'Pct'] = this.teamMap[x].getPercentageActionMajority();   
        }
    }
    return gameInformationJSON;
};

module.exports = TenisGame;