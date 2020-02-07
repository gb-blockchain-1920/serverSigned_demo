var express = require("express");
var router = express.Router();
const Web3 = require("web3");
var Tx = require("ethereumjs-tx").Transaction;

/* GET home page. */
router.get("/", async function(req, res, next) {
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:8545")
  );
  web3.eth.defaultAccount = web3.eth.accounts[0];
  var TestContract = new web3.eth.Contract(
    [
      {
        inputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        constant: true,
        inputs: [
          {
            internalType: "bytes4",
            name: "symbol",
            type: "bytes4"
          }
        ],
        name: "getStockPrice",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            internalType: "bytes4",
            name: "symbol",
            type: "bytes4"
          }
        ],
        name: "getStockVolume",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "bytes4",
            name: "symbol",
            type: "bytes4"
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "volume",
            type: "uint256"
          }
        ],
        name: "setStock",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab"
  );
  // var Test = TestContract.at('0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab');
  var account = "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1";
  var privateKey = new Buffer.from(
    "4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d",
    "hex"
  );

  const getNonce = await web3.eth.getTransactionCount(account);
  console.log("Nonce: " + getNonce);

  var rawTx = {
    // nonce: web3.utils.toHex(11),
    nonce: getNonce,
    // gasPrice: '0x0',
    // gasLimit: '0x470000',
    gas: "0x470000",
    to: "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab",
    // to: '0x0000000000000000000000000000000000000000',
    value: "0x00",
    data: TestContract.methods
      .setStock(web3.utils.toHex("GOOG"), 2000, 10)
      .encodeABI()
  };
  console.log("Hex: "+web3.utils.toHex("GOOG"));
  var tx = new Tx(rawTx);
  tx.sign(privateKey);
  var serializedTx = tx.serialize();
  web3.eth
    .sendSignedTransaction("0x" + serializedTx.toString("hex"))
    .on("receipt", console.log);

  res.render("index", { title: "Express" });
});

module.exports = router;
