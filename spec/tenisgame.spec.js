/**
 * Created by saidatrahouchecharrouti on 12/11/15.
 */

var Players = require('./../modules/players');
var Game = require('./../modules/game');
var TenisGame = require('./../modules/tenisgame');
describe('Who is the winner?', function () {
    var tenisGame;
    beforeEach(function () {
        tenisGame = new TenisGame(new Game(2, new Players(2, [])))
    });
});