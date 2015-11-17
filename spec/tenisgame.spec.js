/**
 * Created by saidatrahouchecharrouti on 12/11/15.
 */

var TenisGame = require('./../modules/tenisgame');


describe('Who is the winner?', function () {
    var tenisGame;
    beforeEach(function () {
        tenisGame = new TenisGame(2, {'left' : 0, 'right': 0});
    });
    
    it('Team 1 winner, 2 votes to left and team 2 with 2 votes to right', function () {
        tenisGame.addVote('team1', 'left', false);
        tenisGame.addVote('team1', 'left', false);
        tenisGame.addVote('team2', 'right', false);
        tenisGame.addVote('team2', 'right', false);
        var winner = tenisGame.getWinner();
        expect(winner).toBe('Team 1');
    });
    
    it('Draw. Please, play our game ;(', function () {
        var winner = tenisGame.getWinner();
        expect(winner).toBe('A draw', false);
    });
    
    it('Team 2 winner, 2 votes to left and team 2 with 2 votes to left', function () {
        tenisGame.addVote('team1', 'left', false);
        tenisGame.addVote('team1', 'left', false);
        tenisGame.addVote('team2', 'left', false);
        tenisGame.addVote('team2', 'left', false);
        var winner = tenisGame.getWinner();
        expect(winner).toBe('Team 2');
    });
    
    it('Give me JSON with total of votes of both teams', function () {
        tenisGame.addVote('team1', 'left', false);
        tenisGame.addVote('team1', 'left', false);
        tenisGame.addVote('team2', 'right', false);
        tenisGame.addVote('team2', 'right', false);
        var information = tenisGame.getVotesGameJSON();
        expect(information).toEqual({'team1': 2, 'team2': 2});
    });

    it('Give me JSON at the end with the game\'s information', function () {
        tenisGame.addVote('team1', 'left', false);
        tenisGame.addVote('team1', 'left', false);
        tenisGame.addVote('team2', 'right', false);
        tenisGame.addVote('team2', 'right', false);
        var information = tenisGame.getGameInformationJSON();
        expect(information).toEqual({'winner': 'Team 1', 'team1Side': 'left', 'team1Pct': '100', 'team2Side': 'right',
                                        'team2Pct': '100'});
    });
});

describe('Error during vote', function () {
    var tenisGame;
    beforeEach(function () {
        tenisGame = new TenisGame(2, {'left' : 0, 'right': 0});
    });
    
    it('because don\'t exist the team', function () {
        expect(function () {
            tenisGame.addVote('team3', 'left', false)
        }).toThrow(new Error('Invalid Team'));
    });
    
    it('because countdown is equal to 0', function(){
        expect(function () {
            tenisGame.addVote('team1', 'left', true)
        }).toThrow(new Error('Timeout')); 
    });
    
    it('because don\'t exist the action', function () {
        expect(function () {
            tenisGame.addVote('team1', 'up', false)
        }).toThrow(new Error('Invalid vote')); 
    });
});