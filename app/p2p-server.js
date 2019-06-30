const Websocket = require('ws');
const P2P_PORT = process.env.P2P_PORT || 5001;
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transaction: 'CLEAR_TRANSACTION'
};
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
class P2pServer{
    constructor(blockchain,transactionPool){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    
    listen() {
        const server = new Websocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));
        this.connectToPeers();
        console.log(`Listening to peer to peer connection on : ${P2P_PORT}`);
    }

    connectToPeers() {
        peers.forEach(peer => {
            console.log('Socket connecting');
            const socket = new Websocket(peer);
            socket.on('open', () => this.connectSocket(socket));
            
        });
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected');
        this.messageHandler(socket);
        this.sendChains(socket);
    }

    messageHandler(socket) {
        
        socket.on('message', message => {
            const data = JSON.parse(message);
            switch(data.type) {
                case MESSAGE_TYPES.chain:
                  this.blockchain.replaceChain(data.chain);
                  break;
                case MESSAGE_TYPES.transaction:
                  this.transactionPool.updateOrAddTransaction(data.transaction);
                  break;
                case MESSAGE_TYPES.clear_transaction:
                   this.transactionPool.clear_transaction();
                   break;
            }
        });
    }

    sendChains(socket) {
        socket.send(JSON.stringify({
            type: MESSAGE_TYPES.chain,
            chain: this.blockchain.chain
          }));
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({
          type: MESSAGE_TYPES.transaction,
          transaction
        }));
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }

    syncChains() {
        this.sockets.forEach(socket => this.sendChains(socket));
    }

    broadcastClearTransaction() {
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPES.clear_transactions
        })));
    }
}
module.exports = P2pServer;