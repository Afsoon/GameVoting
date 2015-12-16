/**
 * Created by saidatrahouchecharrouti on 11/11/15.
 */

var numberTeams;
var playersPlaying;
var routesTeam;

function Players(number, routes){
    if(!(this instanceof Players)){
        return new Players(number, routes);
    }

    routesTeam = routes;
    numberTeams = number;
    playersPlaying = 0;
}

Players.prototype.getNumberTeams = function () {
    return numberTeams;
};

Players.prototype.getNumberPlayersPlaying = function () {
  return playersPlaying;  
};

Players.prototype.addPlayer =  function () {
    var route = routesTeam[playersPlaying%numberTeams];
    playersPlaying++;
    return route;
};

module.exports = Players;