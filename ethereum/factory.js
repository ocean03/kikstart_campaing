import web3 from './web3';
import CampaingFactory from './build/CampaingFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaingFactory.interface),
    '0x9A21dB48321e3bAc7ca2818cEA99Eb077C2f8f49'
);

export default instance;
