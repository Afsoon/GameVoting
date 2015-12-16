/**
 * Created by saidatrahouchecharrouti on 17/11/15.
 */

function GUIDController(){
    if(! (this instanceof  GUIDController)){
        return new GUIDController();
    }
    
    this.GUIDMap = {};
}

GUIDController.prototype._isValidToken = function (tokenID) {
    return !((this.getStatusToken(tokenID))['voted']);
};

GUIDController.prototype.addToken = function (tokenID, side) {
    if((tokenID in this.GUIDMap) ){
        throw new Error('Invalid Token: it exist');
    }
    this.GUIDMap[tokenID] = {'voted': false, 'side': side};
};

GUIDController.prototype.getSide = function (tokenID) {
    console.log(this.GUIDMap);
    if(!(tokenID in this.GUIDMap) ){
        throw new Error('Invalid Token: doesn\'t exist');
    }
    return this.GUIDMap[tokenID]['side'];
};

GUIDController.prototype.getStatusToken = function (tokenID) {
    if(!(tokenID in this.GUIDMap)){
        return false;
    }
    return this.GUIDMap[tokenID]['voted'];  
};

GUIDController.prototype.validTokenVote = function (tokenID) {
    if(this._isValidToken(tokenID)){
            this.GUIDMap[tokenID]['voted'] = true;
            return true;
    }
    return false;
};

GUIDController.prototype.cleanHashMap = function () {
    this.GUIDMap = {};  
};


module.exports = GUIDController;