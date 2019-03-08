import React, { Components } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaing from '../ethereum/campaing'
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class ContributeForm extends Components {
    state = {
        value: '',
        errormsg: '',
        loading: false
    };

    onSubmit = async event => {
        event.preventDefault();
        
        const campaing = Campaing(this.props.address);

        this.setState({loading: true, errormsg: '' });

        try {
            const account = await web3.eth.getAccounts();
            await campaing.methods.contribute().send({
                from: account[0],
                value: web3.utils.towei(this.state.value, 'ether')
            });

            Router.replaceRoute(`/campaings/${this.props.address}`);
        } catch (err) {
            this.setState({errormsg: err.message});
        }

        this.setState({loading: false, value: ''});
    };
    
    render() {
        return(
            <Form onSubmit={this.onSubmit} error={!!this.state.errormsg}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input
                        value={this.state.value}
                        onChange={event => this.setState({value: event.target.value })}
                        label='ether' 
                        labelPosition='right' 
                    />
                </Form.Field>

                <Message error header="Oops!" content={this.state.errormsg} />
                <Button primary loading={this.state.loading}>Contribute!</Button>
            </Form>
        );
    }
}

export default ContributeForm;