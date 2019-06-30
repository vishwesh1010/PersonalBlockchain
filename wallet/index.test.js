const Wallet = require('./index.js');
const TransactionPool = require('./transaction-pool.js');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');
describe('Wallet',()=>{
    let wallet,tp;
    beforeEach(()=>{
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    });
    describe('Creating a transaction',()=>{
        let transaction,sendAmount,recipient;
        beforeEach(()=>{
            sendAmount = 50;
            recipient = 'a1b2c3';
            transaction = wallet.createTransaction(recipient,sendAmount,bc,tp);
        });
        describe('Doing the same transaction',()=>{
            beforeEach(()=>{
                wallet.createTransaction(recipient,sendAmount,bc,tp);
            });
            it('It doubles the sendAmount subtracted from wallet',()=>{
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance-sendAmount*2);
            });
            it('It clones the sendamount output for the recipient',()=>{
                expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toEqual([sendAmount,sendAmount]);
            });
        });

    });
    describe('calculateing balance',() => {
        let addBalance,senderWallet,repeatAll;
        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAll = 3;
            for(let i=0;i<repeatAll;i++) {
                senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
            }
            bc.addBlock(tp.transactions);
        });
        it('calculate balance for blockchain transactions matching the recipient',() => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE+(addBalance*repeatAll));
        });
        it('calculates the balance of sender',() => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE-(addBalance*repeatAll));
        });

        describe('and recipient conducts a transaction',() => {
            let subtractBalance,recipientBalance;
            beforeEach(() => {
                tp.clearTransaction();
                recipientBalance = wallet.calculateBalance(bc);
                wallet.createTransaction(senderWallet.publicKey,subtractBalance,bc,tp);
                bc.addBlock(tp.transactions);
            });
            describe('and sender sends another transaction to recipient',() => {
                beforeEach(() => {
                    tp.clearTransaction();
                    senderWallet.createTransaction(wallet.publicKey,addBalance,bc,tp);
                    bc.addBlock(tp.transactions);
                })
                it('calculate recipient balance only using transaction since its most recent one',() => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance-subtractBalance + addBalance);
                });
            });
        });
    });
    
});