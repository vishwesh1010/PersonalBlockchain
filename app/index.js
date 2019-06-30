const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const HTTP_PORT = process.env.HTTP_PORT || 3001;
const Miner = require('./miner');

const app = express();
const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc,tp);
const miner = new Miner(bc,tp,wallet,p2pServer);
app.get('/blocks',(req,res)=>{
    res.json(bc.chain);
});
app.use(bodyParser.json());
app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);
    p2pServer.syncChains();
    res.redirect('/blocks');
});
app.get('/transactions',(req,res) => {
    res.json(tp.transactions);
});
app.get('/wallet',(req,res) => {
    res.json(wallet);
});
app.post('/transact',(req,res) => {
    const { recipient,amount } = req.body;
    const transaction = wallet.createTransaction(recipient,amount,bc,tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});
app.get('/mine-transaction',(req,res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/blocks'); 
});
app.get('/public-key',(re1,res) => {
    res.json({ publicKey : wallet.publicKey })
});
app.listen(HTTP_PORT, console.log(`Listening to port ${HTTP_PORT}`));
p2pServer.listen(); 