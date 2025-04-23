// wallet.js - Simulação de carteiras para o sistema
const crypto = require('crypto');

class Wallet {
  constructor() {
    // Em um sistema real usaríamos criptografia assimétrica adequada 
    // para blockchain, mas para simplificar usaremos apenas um identificador único
    this.address = crypto.randomBytes(20).toString('hex');
    this.balance = 0;
  }

  getAddress() {
    return this.address;
  }
}

module.exports = Wallet;