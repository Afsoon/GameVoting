/**
 * Created by saidatrahouchecharrouti on 17/11/15.
 */

var GUIDController = require('./../modules/GUIDController');

describe('¿has votado?', function () {
    var guid;
    
    beforeEach(function () {
        guid = new GUIDController();
    });
    
    it('no', function () {
        guid.addToken('1');
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(false);
    });
    
    it('si', function () {
        guid.addToken('1');
        guid.validTokenVote('1');
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(true);
    });
    
    it('token invalido', function () {
       expect(function () {
           guid.getStatusToken('1')
       }).toThrow(new Error('Invalid Token: Doesn\'t exist'));
    });
    
    it('token invalido, ya existe', function () {
        expect(function () {
            guid.addToken('1');
            guid.addToken('1');
        }).toThrow(new Error('Invalid Token: it exist'));
    });

    it('no, no he votado porque no he votado aun en el segundo juego', function () {
        guid.addToken('1');
        guid.validTokenVote('1');
        guid.cleanHashMap();
        guid.addToken('1');
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(false);
    });
    
    it('token invalido porque se ha empezado un nuevo juego', function () {
        expect(function () {
            guid.addToken('1');
            guid.addToken('2');
            guid.validTokenVote('1');
            guid.cleanHashMap();
            guid.getStatusToken('1')
        }).toThrow(new Error('Invalid Token: Doesn\'t exist'));
    });
    
});