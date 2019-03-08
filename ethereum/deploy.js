const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compailedFactory = require('./build/CampaingFactory.json');

const provider = new HDWalletProvider(
  'latin rare father sister february blast satisfy when vivid business enlist boss',
  'https://ropsten.infura.io/v3/e387ad0beb88469bbe177fcec056a9fd'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
 
  console.log('Attemping to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compailedFactory.interface))
    .deploy({ data: compailedFactory.bytecode })
    .send({gas: '1000000',from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};

deploy();