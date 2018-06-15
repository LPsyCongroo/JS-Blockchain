// Import the hashing function
const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash =''){
    // index is not needed
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();

    // A value to change while mining blocks
    this.nonce = 0;
  }

  calculateHash(){
    return SHA256(
        this.previousHash 
      + this.timestamp 
      + JSON.stringify(this.transactions)
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

    // queue for pending transactions while mining
    this.pendingTransactions = [];

    // reward for successful mining of block
    this.miningReward = 10;
  }

  createGenesisBlock(){
    return new Block("01/01/2017", "Genesis Block", "0")
  }

  getLatestBlock(){
    return this.chain[this.chain.length - 1];
  }

  // addBlock(newBlock){
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   // newBlock.hash = newBlock.calculateHash();
  //   newBlock.mineBlock(this.difficulty);
  //   this.chain.push(newBlock);
  // }
  minePendingTransactions(miningRewardAdress){
    // In reality, you can mine ALL pending transactions since each block must be < 1mb
    // Miners choose which transactions to add on.
    const block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);

    console.log('block mined successfully!');    
    this.chain.push(block);

    // reset pending transactions and send reward
    this.pendingTransactions = [
      new Transaction(null, miningRewardAdress, this.miningReward)
    ];
  }

  createTransaction(transaction){
    this.pendingTransactions.push(transaction);
  }
  
  // blockchain doesn't have a "balance" in the usual sense
  getBalanceOfAddress(address){
    let balance = 0;

    for(const block of this.chain)
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

const aliCoin = new Blockchain();

console.log('mining block 1...');
aliCoin.addBlock(new Block(1, "10/07/2017", { amount: 4 }));

console.log('mining block 2...');
aliCoin.addBlock(new Block(2, "10/07/2017", { amount: 4 }));


