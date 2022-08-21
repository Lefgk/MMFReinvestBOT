require("dotenv").config();

const c = require("./Constants");
const Web3 = require("web3");
const url = "https://polygon-rpc.com/";
const web3 = new Web3(url);
const { ethers } = require("ethers");

web3.eth.accounts.wallet.add(
  web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)
);

async function execute() {
  try {
    var contractMMF = new web3.eth.Contract(c.MMFABI, c.MMF);
    var contract = new web3.eth.Contract(c.ABI, c.MC);

    var nonce = await web3.eth.getTransactionCount(c.mywallet);

    var result1 = await contract.methods.deposit(1, 0, c.mywallet).send({
      from: c.mywallet,
      gas: 26e5,
      nonce: nonce,
      maxFeePerGas: ethers.BigNumber.from(40000000000),
      maxPriorityFeePerGas: ethers.BigNumber.from(40000000000),
    });

    var result3 = await contract.methods.deposit(0, 0, c.mywallet).send({
      from: c.mywallet,
      gas: 26e5,
      nonce: nonce + 1,
      maxFeePerGas: ethers.BigNumber.from(40000000000),
      maxPriorityFeePerGas: ethers.BigNumber.from(40000000000),
    });

    var myamt = await contractMMF.methods.balanceOf(c.mywallet).call({
      from: c.mywallet,
    });
    var result2 = await contract.methods.deposit(0, myamt, c.mywallet).send({
      from: c.mywallet,
      gas: 26e5,
      nonce: nonce + 2,
      maxFeePerGas: ethers.BigNumber.from(40000000000),
      maxPriorityFeePerGas: ethers.BigNumber.from(40000000000),
    });

    console.log(`my amount invested is ${myamt / 10 ** 18} MMF`);
  } catch (e) {
    console.log(e);
  }
}

setInterval(async () => {
  execute();
}, 3 * 60000); // run every 3 minutes
