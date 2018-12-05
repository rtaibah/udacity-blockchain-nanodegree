var Web3 = require('web3')

var url = 'HTTP://127.0.0.1:7545' // 8545 if using ganache-cli

var web3 = new Web3(url)

web3.eth.getAccounts().then(accounts => console.log(accounts));
web3.eth.getGasPrice().then(console.log)
//web3.eth.getUncle(1,1).then(console.log)
web3.eth.getBlockTransactionCount(1).then(console.log)
