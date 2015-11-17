/**
 * Created by saidatrahouchecharrouti on 17/11/15.
 */

function GUIDController(){
    if(! (this instanceof  GUIDController)){
        return new GUIDController();
    }
    
    this.GUIDMap = {};
}

GUIDController.prototype.addToken = function (tokenID) {
    if((tokenID in this.GUIDMap) ){
        throw new Error('Invalid Token: it exist');
    }
    this.GUIDMap[tokenID] = false;  
};

GUIDController.prototype.getStatusToken = function (tokenID) {
    if(!(tokenID in this.GUIDMap)){
        throw new Error('Invalid Token: Doesn\'t exist');
    }
    return this.GUIDMap[tokenID];  
};

GUIDController.prototype.validTokenVote = function (tokenID) {
    if(!this.getStatusToken(tokenID)){
            this.GUIDMap[tokenID] = true;
            return true;
    }
    return false;
};

GUIDController.prototype.cleanHashMap = function () {
    this.GUIDMap = {};  
};


module.exports = GUIDController;