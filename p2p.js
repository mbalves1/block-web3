// p2p.js - Comunicação peer-to-peer entre nós
const WebSocket = require('ws');

class P2pServer {
  constructor(blockchain) {
    this.blockchain = blockchain;
    this.sockets = [];
    this.messageTypes = {
      CHAIN: 'CHAIN',
      TRANSACTION: 'TRANSACTION',
      CLEAR_TRANSACTIONS: 'CLEAR_TRANSACTIONS',
    };
  }

  listen(p2pPort, peers) {
    const server = new WebSocket.Server({ port: p2pPort });
    
    server.on('connection', socket => this.connectSocket(socket));
    
    this.connectToPeers(peers);
    
    console.log(`Escutando conexões p2p na porta: ${p2pPort}`);
  }

  connectToPeers(peers) {
    if (!peers) return;
    
    peers.split(',').forEach(peer => {
      const socket = new WebSocket(peer);
      
      socket.on('open', () => this.connectSocket(socket));
      
      socket.on('error', () => console.log(`Falha na conexão com ${peer}`));
    });
  }

  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket conectado');
    
    this.messageHandler(socket);
    
    this.sendChain(socket);
  }

  messageHandler(socket) {
    socket.on('message', message => {
      const data = JSON.parse(message);
      
      switch(data.type) {
        case this.messageTypes.CHAIN:
          this.handleChainMessage(data.chain);
          break;
        case this.messageTypes.TRANSACTION:
          this.handleTransactionMessage(data.transaction);
          break;
        case this.messageTypes.CLEAR_TRANSACTIONS:
          this.blockchain.pendingTransactions = [];
          break;
      }
    });
  }

  sendChain(socket) {
    socket.send(JSON.stringify({
      type: this.messageTypes.CHAIN,
      chain: this.blockchain.chain
    }));
  }

  syncChains() {
    this.sockets.forEach(socket => this.sendChain(socket));
  }

  broadcastTransaction(transaction) {
    this.sockets.forEach(socket => {
      socket.send(JSON.stringify({
        type: this.messageTypes.TRANSACTION,
        transaction
      }));
    });
  }

  broadcastClearTransactions() {
    this.sockets.forEach(socket => {
      socket.send(JSON.stringify({
        type: this.messageTypes.CLEAR_TRANSACTIONS
      }));
    });
  }

  handleChainMessage(chain) {
    // Poderíamos implementar lógica mais sofisticada para verificar
    // se a chain recebida é válida e mais longa que a atual
    if (chain.length > this.blockchain.chain.length) {
      console.log('Cadeia recebida é mais longa que a atual. Substituindo...');
      this.blockchain.chain = chain;
    }
  }

  handleTransactionMessage(transaction) {
    console.log('Nova transação recebida, adicionando ao pool...');
    this.blockchain.addTransaction(transaction);
  }
}

module.exports = P2pServer;