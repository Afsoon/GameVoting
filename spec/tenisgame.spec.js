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
        tenisGame.addVote('team1', 'left');
        tenisGame.addVote('team1', 'left');
        tenisGame.addVote('team2', 'right');
        tenisGame.addVote('team2', 'right');
        var winner = tenisGame.getWinner();
        expect(winner).toBe('Team 1');
    });

    it('Team 2 winner, 2 votes to left and team 2 with 2 votes to left', function () {
        tenisGame.addVote('team1', 'left');
        tenisGame.addVote('team1', 'left');
        tenisGame.addVote('team2', 'right');
        tenisGame.addVote('team2', 'right');
        var winner = tenisGame.getWinner();
        expect(winner).toBe('Team 2');
    });
});