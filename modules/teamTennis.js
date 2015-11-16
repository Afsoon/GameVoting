/**
 * Created by saidatrahouchecharrouti on 14/11/15.
 */
var numberVotesActionMajority;
var actionsMap;
var actionMajority;


function TeamTennis(actions){
    if(!(this instanceof TeamTennis)){
        return TeamTennis(actions);
    }

    numberVotesActionMajority = 0;
    actionMajority = 'none';
    actionsMap = actions;
}

TeamTennis.prototype.getActionMajority = function () {
    return actionMajority;
};

TeamTennis.prototype.addVote = function(action){
    if(!(action in actionsMap)){
        throw Error('Invalid vote');
    }
    actionsMap[action] = actionsMap[action] + 1;
    if(actionsMap[action] > numberVotesActionMajority){
        actionMajority = action;
        numberVotesActionMajority = actionsMap[action];
    }
};

module.exports = TeamTennis;