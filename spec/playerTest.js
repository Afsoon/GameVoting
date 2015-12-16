/**
 * Created by saidatrahouchecharrouti on 11/11/15.
 */

var Players = require('./../modules/players');

describe('Use case: 2 teams', function(){
    var players;
    beforeEach(function(){
        players = new Players(2, ['1', '2']);
    });
    
    it('should be playing in 2 teams', function () {
        var teams = players.getNumberTeams();
        expect(teams).toBe(2);
    });
    
    it('should be playing 0 players', function (){
        var numberPlayers = players.getNumberPlayersPlaying();
        expect(numberPlayers).toBe(0);
    });
    
    it('should be playing 1 player', function (){
        players.addPlayer();
        var numberPlayers = players.getNumberPlayersPlaying();
        expect(numberPlayers).toBe(1);
    });
    
    it('should be playing 1 player at route 1', function () {
        var player = players.addPlayer();
        expect(player).toBe('1');
    });
    
    it('should be player 5 be at route 1', function (){
        for(var i = 0; i < 4; i++){
            players.addPlayer();
        }
        var player = players.addPlayer();
        expect(player).toBe('1');
    });

    it('should be an array with 5 elements [1,2,1,2,1] being routes', function (){
        var routes =  [];
        for(var i = 0; i < 5; i++){
            routes[i] = players.addPlayer();
        }
        expect(routes).toEqual(['1', '2', '1', '2', '1']);
    });
    
});