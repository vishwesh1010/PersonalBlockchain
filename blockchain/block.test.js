const Block = require('./block');
const { DIFFICULTY } = require('../config');
describe('Block',() => {
  let data,lastblock,block;
  beforeEach(() => {
     data = 'bar';
     lastBlock = Block.genesis();
     block = Block.mineBlock(lastBlock,data);
  });
  it('set the `data` to match the input',()=>{
    expect(block.data).toEqual(data);
  });
  it('sets the `lastHash` to match the hash of last block',() => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });
  it('generate a hash that matches the difficulty',()=>{
    expect(block.hash.substring(0,block.difficulty)).toEqual('0'.repeat(block.difficulty));
  });
  it('lowers the diffuculty by 1 for slowly mined blocks', ()=>{
    expect(Block.adjustDifficulty(block,block.timestamp+2000000)).toEqual(block.difficulty-1);
  });
  it('raise difficulty for quickly mined blocks', ()=>{
    expect(Block.adjustDifficulty(block,block.timestamp+2)).toEqual(block.difficulty+1);
  });
});
