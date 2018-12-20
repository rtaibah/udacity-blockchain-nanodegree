var HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = 'tourist nominee average cactus enhance elder bulb satisfy gesture cement learn fog';
const infura = 'https://rinkeby.infura.io/v3/2ae5cedc02454113b8b02a522013726b'

module.exports = {
  compilers: {
    solc: {
      version: "0.4.24",
    }
  },
  networks: { 
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: "*"
    }, 
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, infura),
      network_id: 4,
      gas : 6700000,
      gasPrice : 10000000000
    },
  }
};
