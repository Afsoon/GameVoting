/**
 * Created by saidatrahouchecharrouti on 14/11/15.
 */
'use strict';

function TeamTennis(actions){

    this.numberVotesActionMajority = 0;
    this.actionMajority = 'none';
    this.actionsMap = actions;
    this.totalVotes = 0;
}

TeamTennis.prototype.getTotalVotes = function () {
    return this.totalVotes;  
};

TeamTennis.prototype.getActionMajority = function () {
    return this.actionMajority;
};

TeamTennis.prototype.addVote = function(action){
    if(!(action in this.actionsMap)){
        throw Error('Invalid vote');
    }
    this.actionsMap[action] = this.actionsMap[action] + 1;
    this.totalVotes += 1;
    if(this.actionsMap[action] > this.numberVotesActionMajority){
        this.actionMajority = action;
        this.numberVotesActionMajority = this.actionsMap[action];
    }
};

TeamTennis.prototype.getPercentageActionMajority = function () {
    var percentage;
    if(this.totalVotes === 0){
        return '0';
    } 
    percentage = ((Math.round((this.numberVotesActionMajority/this.totalVotes)*100) * 100) / 100).toString();
    if(percentage === '50'){
        return '51';
    }
    return percentage ;
};

module.exports = TeamTennis;