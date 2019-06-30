const Blockchain = require('./index');
const Block = require('./block');

describe('Blockchain', ()=> {
    let bc;
    beforeEach(()=> {
        bc = new Blockchain();
        bc2 = new Blockchain();
        
    });
    it('First block is genesis block', ()=>{
        expect(bc.chain[0]).toEqual(Block.genesis());
    });
    it('New block added', ()=>{
        const data = "bar";
        bc.addBlock(data);
        expect(bc.chain[bc.chain.length-1].data).toEqual(data);
    });
    
    it('Validate a chain' , ()=>{
        bc2.addBlock("bar");
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });
    it('invalidate a chain with invalid genesis block', ()=>{
        bc2.chain[0].data = "Corrupt";
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });
    it('invalidates a corrupt chain', ()=>{
        bc2.addBlock('xyz');
        bc2.chain[1].data = "gfd";
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });
    it('replace chain with new one', ()=>{
        bc2.addBlock('dg');
        bc.replaceChain(bc2.chain);
        expect(bc.chain).toEqual(bc2.chain);
    });
    it('doesnt replace chain with one of less or equal length',()=>{
        bc.addBlock('xyz');
        bc.replaceChain(bc2.chain);
        expect(bc.chain).not.toEqual(bc2.chain);
    });
});