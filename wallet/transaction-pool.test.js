const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');
describe('TransactionPool',()=>{
    let tp,transaction,wallet;
    beforeEach(()=>{
        tp = new TransactionPool();
        wallet = new Wallet();
        bc = new Blockchain();
        
        transaction = wallet.createTransaction('a1b2c3d4', 30, bc, tp);
    });
    it('add a transaction to transaction pool',()=>{
        expect(tp.transactions.find(t=>t.id === transaction.id)).toEqual(transaction);
    });
    it('update a transaction',()=>{
        const oldTransaction = JSON.stringify(transaction);
        nextAmount = 10;
        nextRecipient = 'a1b2c3';
        const newTransaction = transaction.update(wallet,nextRecipient,nextAmount);
        
        tp.updateOrAddTransaction(newTransaction);
        expect(JSON.stringify(tp.transactions.find(t=>t.id === newTransaction.id ))).not.toEqual(oldTransaction);
    });
    it('clears transaction pool',() => {
        tp.clearTransaction();
        expect(tp.transactions).toEqual([]);
    });
    describe('mixing valid and corrupt transaction',() => {
        let validTransactions;
        beforeEach(() => {
            validTransactions = [...tp.transactions];
            for (let i=0;i<6;i++) {
                wallet = new Wallet();
                transaction = wallet.createTransaction('a1b2c3d4',30,bc, tp);
                if(i%2 == 0){
                    transaction.input.amount = 9999;
                }
                else{
                    validTransactions.push(transaction);
                }
            }
        });
        it('shows a difference between valid and corrupt transaction',() => {
            expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.validTransactions);
        });
        it('grab valid transaction',() => {
            expect(tp.validTransaction()).toEqual(validTransactions);
        });
    });
});
