const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const ec = new EC('secp256k1');
const uuidV1 = require('uuid/v1');
class ChainUtils{
    static genKeyPair() {
        return ec.genKeyPair();
    }
    static id(){
        return uuidV1();
    }
    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }

    static verifySignature(publicKey, signature, dataHash) {
        var key = ec.keyFromPublic(publicKey, 'hex'); 
        if(publicKey!=undefined && signature!=undefined && dataHash!=undefined){
            var key = ec.keyFromPublic(publicKey, 'hex'); 
            return key.verify(dataHash, signature);
        }
        else{
            console.log("Not");
            return;
        }
        
    }
}
module.exports = ChainUtils;