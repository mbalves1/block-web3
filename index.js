// index.js - Ponto de entrada da aplicação
const Node = require('./node');

const HTTP_PORT = process.env.PORT || 3001;
const P2P_PORT = process.env.P2P_PORT || 6001;
const PEERS = process.env.PEERS;

const node = new Node();
node.start(HTTP_PORT, P2P_PORT, PEERS);

console.log(`Nó iniciado - HTTP: ${HTTP_PORT}, P2P: ${P2P_PORT}`);
if (PEERS) {
  console.log(`Conectando aos peers: ${PEERS}`);
}