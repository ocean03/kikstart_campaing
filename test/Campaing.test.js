const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaingFactory.json');
const compiledCampaing = require('../ethereum/build/Campaing.json');

let accounts;
let factory;
let campaingAddress;
let campaing;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.createCampaing('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaingAddress] = await factory.methods.getDeployedCampaings().call();
    campaing = await new web3.eth.Contract(
        JSON.parse(compiledCampaing.interface),
        campaingAddress
    );
});

describe('Campaings', () => {
    it('deploy a factory and campaing', () => {
        assert.ok(factory.options.address);
        assert.ok(campaing.options.address);
    });

    it('marks celler as the campaing manager', async () => {
        const manager = await campaing.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allow people to contribute mony and marks them as approvers', async () => {
        await campaing.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributer = await campaing.methods.approvers(accounts[1]).call();
        assert(isContributer);
    });

    it('requires minimum contribution', async () => {
        try {
            await campaing.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('allow a manager to make a payment request', async () => {
        await campaing.methods
            .createRequest('Buy batteries', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        const request = await campaing.methods.requests(0).call();

        assert.equal('Buy batteries', request.description);
    });

    it('process request', async () => {
        await campaing.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaing.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000'});

        await campaing.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaing.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104);
    });
});