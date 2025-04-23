# Simulação de Ambiente Web3 com Node.js

Este projeto é uma simulação didática de um ambiente Web3, implementando uma blockchain básica com comunicação peer-to-peer entre múltiplos nós. O objetivo é demonstrar os conceitos fundamentais de blockchain, transações descentralizadas e comunicação P2P em um ambiente controlado.

## Características

- Implementação simplificada de blockchain com prova de trabalho
- Sistema de carteiras com endereços
- Transações entre usuários
- Mineração de blocos com recompensa
- Comunicação peer-to-peer entre nós usando WebSockets
- API RESTful para interagir com cada nó

## Pré-requisitos

- Node.js (versão 14.x ou superior)
- npm (gerenciador de pacotes do Node)

## Instalação

1. Clone o repositório ou crie os arquivos manualmente
2. Instale as dependências:

```bash
npm install
```

## Estrutura do Projeto

```
web3-sim/
├── package.json
├── blockchain.js  # Implementação da blockchain e transações
├── wallet.js      # Implementação simplificada de carteiras
├── p2p.js         # Servidor para comunicação peer-to-peer
├── node.js        # Representação de um nó na rede
└── index.js       # Ponto de entrada da aplicação
```

## Como Executar

Para executar a simulação com 3 nós independentes, abra 3 terminais separados e execute:

### Terminal 1 (Nó 1):
```bash
npm run node1
```

### Terminal 2 (Nó 2):
```bash
npm run node2
```

### Terminal 3 (Nó 3):
```bash
npm run node3
```

Cada nó terá seu próprio servidor HTTP e servidor P2P rodando em portas diferentes:
- Nó 1: HTTP na porta 3001, P2P na porta 6001
- Nó 2: HTTP na porta 3002, P2P na porta 6002
- Nó 3: HTTP na porta 3003, P2P na porta 6003

O Nó 2 se conectará automaticamente ao Nó 1, e o Nó 3 se conectará tanto ao Nó 1 quanto ao Nó 2.

## API

Cada nó expõe as seguintes APIs:

### Obter a blockchain completa
```
GET /blocks
```

### Obter transações pendentes
```
GET /transactions
```

### Enviar uma nova transação
```
POST /transact
Body: { "recipient": "endereco-destino", "amount": 50 }
```

### Minerar um novo bloco
```
POST /mine
```

### Obter informações da carteira
```
GET /wallet
```

## Exemplo de Uso

1. **Consultar o endereço da carteira do Nó 2**:
```bash
curl http://localhost:3002/wallet
```

2. **Enviar 50 tokens do Nó 1 para o Nó 2**:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"recipient":"ENDERECO_DO_NO_2","amount":50}' http://localhost:3001/transact
```

3. **Minerar um bloco para confirmar a transação**:
```bash
curl -X POST http://localhost:3001/mine
```

4. **Verificar se todos os nós têm a mesma blockchain**:
```bash
curl http://localhost:3001/blocks
curl http://localhost:3002/blocks
curl http://localhost:3003/blocks
```

## Como Funciona

1. **Blockchain**: Cada nó mantém uma cópia da blockchain. Quando um nó minera um novo bloco, ele o adiciona à sua blockchain e o transmite para os outros nós.

2. **Transações**: Quando um usuário cria uma transação, ela é adicionada ao pool de transações pendentes e transmitida para todos os nós.

3. **Mineração**: Quando um nó minera um bloco, ele inclui todas as transações pendentes nesse bloco e recebe uma recompensa.

4. **Consenso**: Quando um nó recebe uma blockchain de outro nó, ele a aceita se for mais longa que a sua própria (regra do consenso de prova de trabalho).

## Limitações

Este projeto é uma simulação didática e tem várias simplificações em relação a uma blockchain real:

- Não há validação criptográfica real das transações
- O mecanismo de consenso é simplificado
- Não há persistência de dados (tudo é mantido na memória)
- A descoberta de peers é manual
- Não há implementação de contratos inteligentes

## Expansões Possíveis

- Implementar assinaturas digitais para validação de transações
- Adicionar sistema de contratos inteligentes simples
- Implementar uma interface web para interação visual
- Adicionar mecanismo de descoberta automática de peers
- Implementar persistência de dados