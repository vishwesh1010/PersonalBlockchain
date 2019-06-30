const Transaction = require('./transaction.js');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');

describe('Transaction',()=>{
    let transaction,amount,wallet,receipient;
    beforeEach(()=>{
        wallet = new Wallet();
        amount = 100;
        receipient = 'ah1hjh34';
        transaction = Transaction.newTransaction(wallet,receipient,amount);
    });
    it('outputs the `amount` subtracted from balance',()=>{
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance-amount);
    });
    it('outputs the `amount` added to recepient',()=>{
        expect(transaction.outputs.find(output => output.address === receipient).amount).toEqual(amount);
    });
    it('Inputs the balance of wallet',()=>{
        expect(transaction.input.amount).toEqual(wallet.balance);
    });
    
    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
      });
    it('invalidates a corrupt transaction', () => {
        transaction.outputs[0].amount = 50000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });
    
    
    describe('Transaction with amount that exceeds current balance',()=>{
        
        beforeEach(()=>{
            amount = 100000;
            transaction = Transaction.newTransaction(wallet,receipient,amount);
        });
        it('Amount greater than balance',()=>{
            expect(transaction).toEqual(undefined);
        });
    });

    describe('and updating transaction',()=> {
        beforeEach(()=>{
            nextAmount = 50;
            nextRecipient = 'a1b2c3';
            transaction = transaction.update(wallet,nextRecipient,nextAmount);
        });
        it('subtracts the amount from senders output',()=>{
            expect(transaction.outputs.find(output=>output.address == wallet.publicKey).amount).toEqual(wallet.balance-amount-nextAmount);
        })
        it('Outputs an amount for next recipient',()=>{
            expect(transaction.outputs.find(output=>output.address == nextRecipient).amount).toEqual(nextAmount);
        })
    });

    describe('reating a reward transaction',() => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet,Wallet.blockchainWallet());
        });
        it('rewards the miner wallet',() => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
        });
    });
});