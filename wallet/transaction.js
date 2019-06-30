const ChainUtils = require('../chain-utils');
const { MINING_REWARD } = require('../config');
class Transaction {
    constructor(){
        this.id = ChainUtils.id();
        this.input = null;
        this.outputs = [];
    }

    update(senderWallet,recipient,amount) {
        
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
        if(amount > senderOutput.amount){
            console.log(`Amount : ${amount} is higher than balance`);
            return;
        }
        senderOutput.amount -= amount;
        this.outputs.push({amount,address:recipient});
        Transaction.signTransaction(this,senderWallet);
        
        return this;
    }

    static newTransaction(senderWallet,recipient,amount){
        const transaction = new this();
        if(amount>senderWallet.balance){
            console.log(`Amount ${amount} exceeds balance`);
            return;
        }
        
        Transaction.signTransaction(transaction,senderWallet);
        return Transaction.transactionsWithOutputs(senderWallet,[
            { amount : senderWallet.balance - amount,address: senderWallet.publicKey },
            { amount,address:recipient }
        ]);
        
    }

    static transactionsWithOutputs(senderWallet, outputs){
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
    }

    static rewardTransaction(minerWallet, blockchainWallet) {
        return Transaction.transactionsWithOutputs(blockchainWallet, [{
            amount : MINING_REWARD, address : minerWallet.publicKey
        }]);
    }

    static signTransaction(transaction,senderWallet){
        transaction.input = {
            timestamp : Date.now(),
            address : senderWallet.publicKey,
            amount : senderWallet.balance,
            signature : senderWallet.sign(ChainUtils.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction) {
        return ChainUtils.verifySignature(
          transaction.input.address,
          transaction.input.signature,
          ChainUtils.hash(transaction.outputs)
        );
    }

    
}
module.exports = Transaction;   