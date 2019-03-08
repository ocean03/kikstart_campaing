import web3 from './web3';
import Camapaing from './build/Camapaing.json';

export default (address) => {
    return new web3.eth.Contract(JSON.parse(Camapaing.interface), address);
};