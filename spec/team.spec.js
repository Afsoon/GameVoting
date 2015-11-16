/**
 * Created by saidatrahouchecharrouti on 14/11/15.
 */

var TeamTennis = require('./../modules/teamTennis');

describe('Team', function () {
    var team;
    beforeEach(function () {
       team = new TeamTennis({'left' : 0, 'right': 0});
    });
    
    it('add 1 vote to left action', function () {
        team.addVote('left');
        var json = team.getActionMajority();
        expect(json).toEqual({'left' : 1});
    });
    
    it('add invalid vote because no exist', function () {
        expect(function(){team.addVote('up')}).toThrow(new Error('Invalid vote'));
    });
    
    it('add 3 votes, 2 to left and 1 to right. left to be Majority', function () {
        team.addVote('right');
        team.addVote('left');
        team.addVote('left');
        var json = team.getActionMajority();
        expect(json).toEqual({'left' : 2});
    });
    
    it('add 2 votes, 1 to right and 1 to left. right to be Majority', function (){
        team.addVote('right');
        team.addVote('left');
        var json = team.getActionMajority();
        expect(json).toEqual({'right' : 1});
    });
});