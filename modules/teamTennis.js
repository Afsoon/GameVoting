/**
 * Created by saidatrahouchecharrouti on 14/11/15.
 */

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
    this.totalVotes++;
    if(this.actionsMap[action] > this.numberVotesActionMajority){
        this.actionMajority = action;
        this.numberVotesActionMajority = this.actionsMap[action];
    }
};

module.exports = TeamTennis;