/**
 * Created by saidatrahouchecharrouti on 16/11/15.
 */
var TenisGame = require('./../modules/tenisgame');
describe('variables de diferentes instancias', function () {
    it('Se tiene que compartir  las varibles entre distintas instancias de TenisGame', function () {
        var tenisGameInstance = new TenisGame(2, {'left':0, 'right': 0});
        var tenisGameInstance2 = new TenisGame(2, {'left':0, 'right': 0});
        tenisGameInstance.addVote('team1', 'left');
        var message = tenisGameInstance2.getWinner();
        expect(message).toBe('draw');
    });
});
