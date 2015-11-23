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
        guid.addToken('1', 'left');
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(false);
    });
    
    it('si', function () {
        guid.addToken('1', 'left');
        guid.validTokenVote('1');
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(true);
    });
    
    it('token invalido', function () {
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(false);
    });
    
    it('token invalido, ya existe', function () {
        expect(function () {
            guid.addToken('1', 'left');
            guid.addToken('1', 'left');
        }).toThrow(new Error('Invalid Token: it exist'));
    });

    it('no, no he votado porque no he votado aun en el segundo juego', function () {
        guid.addToken('1', 'left');
        guid.validTokenVote('1');
        guid.cleanHashMap();
        guid.addToken('1', 'left');
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(false);
    });
    
    it('token invalido porque se ha empezado un nuevo juego', function () {
        guid.addToken('1');
        guid.addToken('2');
        guid.validTokenVote('1');
        guid.cleanHashMap();
        var voted = guid.getStatusToken('1');
        expect(voted).toBe(false);
    });
    
});