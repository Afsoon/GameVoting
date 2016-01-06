/**
 * Created by saidatrahouchecharrouti on 17/11/15.
 */

var GUIDController = require('./../modules/GUIDController');

describe('have you voted?', function () {
    var guid;
    
    beforeEach(function () {
        guid = new GUIDController();
    });
    
    it('No, i have\'nt', function () {
        guid.addToken('1', 'left');
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(false);
    });
    
    it('Yes and it\'s a valid vote', function () {
        guid.addToken('1', 'left');
        guid.validTokenVote('1');
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(true);
    });
    
    it('No, because it\'s a invalid token', function () {
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(false);
    });
    
    it('Can\'t vote because I\'m register at this game or someone have my same token', function () {
        expect(function () {
            guid.addToken('1', 'left');
            guid.addToken('1', 'left');
        }).toThrow(new Error('Invalid Token: it exist'));
    });

    it('No, because I am only register at second game', function () {
        guid.addToken('1', 'left');
        guid.validTokenVote('1');
        guid.cleanHashMap();
        guid.addToken('1', 'left');
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(false);
    });
    
    it('No, because I voted the first game and I am not register at second game', function () {
        guid.addToken('1');
        guid.addToken('2');
        guid.validTokenVote('1');
        guid.cleanHashMap();
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(false);
    });
    
});