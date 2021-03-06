// Import the hashing function
const SHA256 = require('crypto-js/sha256');

// Create a block class
class Block {
  constructor(index, timestamp, data, previousHash =''){
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash(){
    return SHA256(
        this.index
      + this.previousHash 
      + this.timestamp 
      + JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock(){
    return new Block(0, "01/01/2017", "Genesis Block", "0")
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid(){
    for(let i = 1; i < this.chain.length; i++){
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      
      // Actual hash of the current block does not match with what it should be
      if(currentBlock.hash !== currentBlock.calculateHash()){
        return false;
      }

      // Check if previous hash matches up
      if(currentBlock.previousHash !== previousBlock.hash){
        return false;
      }
    }
    return true;
    
  }

}

let aliCoin = new Blockchain();
aliCoin.addBlock(new Block(1, "10/07/2017", { amount: 4 }));
aliCoin.addBlock(new Block(2, "10/07/2017", { amount: 4 }));

// console.log(JSON.stringify(aliCoin, null, 4));
console.log('is blockchain valid? ' + aliCoin.isChainValid());

//let's tamper with the data!
aliCoin.chain[1].data = { amount: 1000000000 };
console.log('is blockchain valid? ' + aliCoin.isChainValid());

// let's try something more clever...
aliCoin.chain[1].hash = aliCoin.chain[1].calculateHash();
console.log('is blockchain valid? ' + aliCoin.isChainValid());

// Let's be MOAR clever!
aliCoin.chain[2].previousHash = aliCoin.chain[1].hash;
aliCoin.chain[2].hash = aliCoin.chain[2].calculateHash();
console.log('is blockchain valid? ' + aliCoin.isChainValid());

// At this point, we can change the data if we update the hash for the rest of the chain

