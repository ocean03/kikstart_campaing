import React, { Component } from 'react';
import { Form, Button, Message, Input } from 'semantic-ui-react';
import Campaing from '../../../ethereum/campaing';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';

class RequestNew extends Component {
    state = {
        value: '',
        description: '',
        recipient: '',
        loading: false,
        errormsg: ''
        
    };

    static async getInitialProps(props) {
        const { address } = props.query;

        return { address };
    }

    onSubmit = async event => {
        event.preventDefault();

        const campaing= Campaing(this.props.address);
        const { description, value, recipient } = this.state;

        this.setState({ loading: true, errormsg: '' });

        try{
            const accounts = await web3.eth.getAccounts();
            await campaing.methods
                .createRequest(description,web3.utils.towei(value, 'ether'),recipient)
                .send({ from: accounts[0] });
            
            Router.pushRoute(`/campaings/${this.props.address}/requests`);
        } catch (err) {
            this.setState({ errormsg: err.message });
        }

        this.setState({ loading: false })
    };

    render() {
        return (
            <Layout>
                <Link route={`/campaings/${this.props.address}/requests`}>
                    <a>Back</a>
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errormsg}>
                    <Form.Field>
                        <label>Description</label>
                        <Input 
                            value={this.state.description}
                            onChange={event =>  
                                this.state({ description: event.target.value })}
                        />
                    </Form.Field>
                    
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input 
                            value={this.state.value}
                            onChange={event =>  
                                this.state({ description: event.target.value })}
                        />
                    </Form.Field>
                    
                    <Form.Field>
                        <label>Recipient</label>
                        <Input 
                            value={this.state.recipient}
                            onChange={event =>  
                                this.state({ description: event.target.value })}
                        />    
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errormsg} />
                    <Button primary loading={this.state.loading}>Create!</Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;