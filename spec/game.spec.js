/**
 * Created by saidatrahouchecharrouti on 11/11/15.
 */
var Game = require('./../modules/game');
var Players = require('./../modules/players');
var players = new Players(2, []);

describe('Who are playing?', function () {
    var game;
    beforeEach(function () {
        game = new Game(2, players);
    });
    
    it('None and should be 0 votes', function () {
        var votes = game.getTotalNumberOfVotes();
        expect(votes).toBe(0);
    });
    
    it('None and should be 0 votes as [0,0,0,0]', function () {
        var matrixAsArray = game.getArrayMatrix();
        expect(matrixAsArray).toEqual([0,0,0,0]);
    });
    
    it('1 is playing, should be 1 vote', function() {
        game.addVote(1,1);
        var votes = game.getTotalNumberOfVotes();
        expect(votes).toBe(1);
    });
    
    it('1 is playing, should be an error because he do a team\'s invalid vote', function () {
        expect(function() { game.addVote(3,0) }).toThrow(new Error('Invalid vote'));
    });
    
    it('1 is playing, should be an error because he do a options\' invalid vote', function () {
        expect(function() { game.addVote(0, -2) }).toThrow(new Error('Invalid vote'));
    });
    
    it('1 is playing, should be an error because he do a team\'s and options\' invalid vote', function () {
        expect(function() { game.addVote(-2, 7)}).toThrow(new Error('Invalid vote'));
    });


    it('5 is playing, should be 2 vote valid and 3 invalid', function () {
        try{
            game.addVote(1,2); //Invalid
        }catch(err){
            
        }
        game.addVote(0,0); //Valid
        game.addVote(1,1); //Valid
        
        try{
            game.addVote(-2,0); //Invalid
        }catch(err){

        }
        
        try{
            game.addVote(0,6); //Invalid
        }catch(err){

        }
        var votes = game.getTotalNumberOfVotes();
        expect(votes).toBe(2);
    });
});
