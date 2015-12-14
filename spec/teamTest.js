/**
 * Created by saidatrahouchecharrouti on 14/11/15.
 */

var TeamTennis = require('./../modules/teamTennis');

describe('Team', function () {
    var team;
    beforeEach(function () {
       team = new TeamTennis();
    });
    
    it('add 1 vote to left action', function () {
        team.addVote('left');
        var action = team.getActionMajority();
        expect(action).toBe('left');
    });
    
    it('add invalid vote because no exist', function () {
        expect(function(){team.addVote('up')}).toThrow(new Error('Invalid vote'));
    });
    
    it('add 3 votes, 2 to left and 1 to right. left to be Majority', function () {
        team.addVote('right');
        team.addVote('left');
        team.addVote('left');
        var action = team.getActionMajority();
        expect(action).toBe('left');
    });
    
    it('add 2 votes, 1 to right and 1 to left. right to be Majority', function (){
        team.addVote('right');
        team.addVote('left');
        var action = team.getActionMajority();
        expect(action).toBe('right');
    });
    
    it('No one vote, none', function () {
        var action = team.getActionMajority();
        expect(action).toBe('none');
    });
    
    it('Should have 5 votes. Because they get 8 votes but 3 invalid', function () {
        team.addVote('left');
        try{
            team.addVote('up');
        }catch(err){}
        team.addVote('right');
        team.addVote('left');
        try{
            team.addVote('down');
        }catch(err){}
        try{
            team.addVote('QUIERO TRABAJO');
        }catch(err){}
        team.addVote('left');
        team.addVote('right');
        var totalVotes = team.getTotalVotes();
        expect(totalVotes).toBe(5);
    });
    
    it('Should be 100 (%) because everyone vote left action', function () {
        team.addVote('left');
        var percetange = team.getPercentageActionMajority();
        expect(percetange).toBe('100');
    });
    
    it('Should be 51 (%) because we have a draw, someone MUST win', function () {
        team.addVote('left');
        team.addVote('right');
        var percetange = team.getPercentageActionMajority();
        expect(percetange).toBe('51');
    });
});