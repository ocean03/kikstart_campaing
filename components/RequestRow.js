import React, { Component} from 'react';
import { Table, Button } from 'semantic-ui-react0;'
import web3 from '../ethereum/web3';
import Campaing from '../ethereum/campaing';

class RequestRow extends Component {
    onApprove = async () => {
        const campaing = Campaing(this.props.address);

        const accounts = await web3.eth.getAccounts();
        await campaing.methods.aproveRequest(this.props.id).send({
             from: accounts[0]
        });
    };

    onFinalize = async () => {
        const campaing = Campaing(this.props.address);

        const accounts = await web3.eth.getAccounts();
        await campaing.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        });
    };

    render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2 ;

        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{this.props.id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromwei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvelCount}/{approversCount}</Cell>
                <Cell>
                    {request.complete ? null : (
                        <Button color="green" basic onClick={this.onApprove}>Appove</Button>
                    )}   
                </Cell>
                <Cell>
                    {request.complete ? null : (
                        <Button color="teal" basic onClick={this.onFinalize}>Finalize</Button>
                    )}
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;