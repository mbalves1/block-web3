// node.js - Representa um nó na rede
const express = require('express');
const bodyParser = require('body-parser');
const { Blockchain, Transaction } = require('./blockchain');
const P2pServer = require('./p2p');
const Wallet = require('./wallet');

class Node {
  constructor() {
    this.app = express();
    this.blockchain = new Blockchain();
    this.wallet = new Wallet();
    this.p2pServer = new P2pServer(this.blockchain);
    
    this.setupExpress();
  }

  setupExpress() {
    this.app.use(bodyParser.json());
    
    // Endpoint para obter a blockchain completa
    this.app.get('/blocks', (req, res) => {
      res.json(this.blockchain.chain);
    });

    // Endpoint para minerar um novo bloco
    this.app.post('/mine', (req, res) => {
      this.blockchain.minePendingTransactions(this.wallet.getAddress());
      this.p2pServer.syncChains();
      res.redirect('/blocks');
    });

    // Endpoint para enviar uma nova transação
    this.app.post('/transact', (req, res) => {
      const { recipient, amount } = req.body;
      
      const transaction = new Transaction(
        this.wallet.getAddress(),
        recipient,
        amount
      );
      
      this.blockchain.addTransaction(transaction);
      this.p2pServer.broadcastTransaction(transaction);
      
      res.redirect('/transactions');
    });

    // Endpoint para ver transações pendentes
    this.app.get('/transactions', (req, res) => {
      res.json(this.blockchain.pendingTransactions);
    });

    // Endpoint para ver o endereço da carteira deste nó
    this.app.get('/wallet', (req, res) => {
      res.json({
        address: this.wallet.getAddress(),
        balance: this.blockchain.getBalanceOfAddress(this.wallet.getAddress())
      });
    });
  }

  start(httpPort, p2pPort, peers) {
    this.app.listen(httpPort, () => {
      console.log(`Servidor HTTP iniciado na porta ${httpPort}`);
    });
    
    this.p2pServer.listen(p2pPort, peers);
  }
}

module.exports = Node;