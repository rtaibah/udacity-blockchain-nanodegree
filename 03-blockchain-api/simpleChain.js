const Block = require('./block')

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

const SHA256 = require('crypto-js/sha256');


class Blockchain{
  constructor(){
    this.getBlockHeight().then((height) => {
      if (height === -1){
        this.addBlock(new Block("First block in the chain - Genesis block"))
      }
    })
  }

  // Add new block
  async addBlock(newBlock){
    // Block height
    const height = parseInt(await this.getBlockHeight())
    newBlock.height = height+1
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    // previous block hash
    if(newBlock.height>0){
      const previousBlockHeight = newBlock.height - 1 
      const previousBlock = JSON.parse(await this.getBlock(previousBlockHeight))
      newBlock.previousBlockHash = previousBlock.hash 
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    // Adding block object to chain
    await addBlockToDB(newBlock.height, JSON.stringify(newBlock));
  }

  // Get block height
  async getBlockHeight(){
    return await getBlockHeightFromDB().catch(e=>console.log("error",e))
  }

  // get block
  async getBlock(blockHeight){
    // return object as a single string
    return await getBlockFromDB(blockHeight);
  }

  // validate block
  async validateBlock(blockHeight){
    // get block object
    let block = JSON.parse(await (this.getBlock(blockHeight)))
    // get block hash
    let blockHash = block.hash;
    // remove block hash to test block integrity
    block.hash = '';
    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString();
    // Compare
    if (blockHash===validBlockHash) {
        console.log('Block is valid!')
        return true;

      } else {
        console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
        return false;
      }
  }

 // Validate blockchain
  async validateChain(){
    let errorLog = [];
    for (var i = 0; i < await this.getBlockHeight-1; i++) {
      // validate block
      if (await !this.validateBlock(i))errorLog.push(i);
      // compare blocks hash link
      let blockHash = JSON.parse(await this.getBlock(i)).hash;
      let previousHash = JSON.parse(await this.getBlock(i+1)).previousBlockHash;
      if (blockHash!==previousHash) {
        errorLog.push(i);
      }
    }
    if (errorLog.length>0) {
      console.log('Block errors = ' + errorLog.length);
      console.log('Blocks: '+errorLog);
    } else {
      console.log('No errors detected');
    }
  }
}

// Leveldb functions

// Add block to levelDB with key/value pair
function addBlockToDB(key,value){
  return new Promise((resolve, reject) => {
    db.put(key, value, (error) =>  {
      if (error){
        reject(error) }
      console.log(`Block added ${key}`)
      resolve(`Block added ${key}`)
    });
  })
}

// Get block from levelDB with key
function getBlockFromDB(key){
  return new Promise((resolve, reject) => {
    db.get(key,(error, value) => {
      if (error){
        reject(error)
      }
      console.log(`Block requested ${value}`)
      resolve(value)
    });
  })
}

// Get block height
function getBlockHeightFromDB() {
    return new Promise((resolve, reject) => {
      let height = -1

      db.createReadStream().on('data', (data) => {
        height++
      }).on('error', (error) => {
        reject(error)
      }).on('close', () => {
        console.log(`Block Height ${height}`)
        resolve(height)
      })
    })
}

module.exports = new Blockchain();

(function theLoop (i) {
  setTimeout(function () {
    let blockchain = new Blockchain()
    blockchain.addBlock(new Block('Testing data'));
    if (--i) theLoop(i);
  }, 100);
})(10);
