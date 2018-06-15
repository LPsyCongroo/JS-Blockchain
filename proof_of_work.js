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

    // A value to change while mining blocks
    this.nonce = 0;
  }

  calculateHash(){
    return SHA256(
        this.index
      + this.previousHash 
      + this.timestamp 
      + JSON.stringify(this.data)
      + this.nonce
    ).toString();
  }

  // proof of work
  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }
}

class Blockchain{
  constructor(){
    this.chain = [this.createGenesisBlock()];
    // Incrementing this number makes mining take longer!
    this.difficulty = 2;
  }

  createGenesisBlock(){
    return new Block(0, "01/01/2017", "Genesis Block", "0")
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock){
    newBlock.previousHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
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

      return true;
    }
  }
}

let aliCoin = new Blockchain();

console.log('mining block 1...');
aliCoin.addBlock(new Block(1, "10/07/2017", { amount: 4 }));

console.log('mining block 2...');
aliCoin.addBlock(new Block(2, "10/07/2017", { amount: 4 }));


/**
 * how to stop someone adding a block
 * what happens if a block is added before you finish mining
 * how to fix a successful addition to block chain
 */