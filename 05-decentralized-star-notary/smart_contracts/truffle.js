var HDWalletProvider = require('truffle-hdwallet-provider');

const mnemonic = 'jelly gun feel polar kangaroo social elevator chaos soap dose cage lesson';
const infura = 'https://rinkeby.infura.io/v3/faef7cbe49c54cd9b1925cd338647f2d'

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
