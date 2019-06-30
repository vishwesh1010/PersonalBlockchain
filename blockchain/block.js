const chainUtils = require('../chain-utils');
const { DIFFICULTY,MINE_RATE } = require('../config');

class Block {
  constructor(timestamp, lastHash, hash, data, nonce, difficulty){
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }
  toString(){
    return `Block-
    timestanp = ${this.timestamp}
    lasthash = ${this.lastHash}
    hash = ${this.hash}
    nonce = ${this.nonce}
    difficulty : ${this.difficulty} 
    data = ${this.data}
    `;
  }
  static genesis(){
    return new this('Genesis','----','jhdgf',[],0,DIFFICULTY);
  }
  static mineBlock(lastBlock,data){
    let timestamp ;
    let hash ;
    const lastHash = lastBlock.hash;
    let {difficulty} = lastBlock;
    let nonce = 0;
    do{
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock,timestamp);
      hash = Block.hash(timestamp,lastHash,data,nonce,difficulty);

    }while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));
    
    return new this(timestamp,lastHash,hash,data,nonce,difficulty);
  }
  static hash(timestamp,lastHash,data,nonce,difficulty){
    return chainUtils.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }
  static blockHash(block){
    return this.hash(block.timestamp,block.lastHash,block.data,block.nonce,block.difficulty);
  }
  static adjustDifficulty(lastBlock,currentTime) {
    let {difficulty} = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty+1 : difficulty-1;
    return difficulty;
  }

}

module.exports = Block;
