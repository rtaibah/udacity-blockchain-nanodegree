var Web3 = require('web3');
var EthereumTransaction = require('ethereumjs-tx');
var web3 = new Web3('http://127.0.0.1:7545');

var sendingAddress = '0x17ea42627dE27b521c44170A3EB4b67803679cCC';
var receivingAddress = '0xb4184bf7ea71610A3cCbE56Ea7504ae189B668DC';

web3.eth.getBalance(sendingAddress).then(console.log)
web3.eth.getBalance(receivingAddress).then(console.log)

var rawTransaction = {
  nonce: 3,
  to: receivingAddress,
  gasPrice: 2000000000,
  gasLimit: 30000,
  value: 100000000000000000,
  data: ''
}

var privateKeySender = 'c4f8cd278dfcd46b1d844e7c19b9b8c9a5a0d67194fa44bd48ac8cda18def51d'
var privateKeySenderHex = new Buffer(privateKeySender, 'hex') 
var transaction = new EthereumTransaction(rawTransaction)
transaction.sign(privateKeySenderHex)

var serializedTransaction = transaction.serialize();
web3.eth.sendSignedTransaction(serializedTransaction)
