import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaingNew extends Component {
    state = {
        minimumContribution: '',
        errormsg: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();
        
        this.setState({ loading: true, errormsg: '' });

        try {
            const accounts = web3.eth.getAccounts();
            console.log(accounts);
            await factory.methods
            .createCampaing(this.state.minimumContribution).send({
                from: accounts[0]
            });

            Router.pushRoute('/');
        } catch (err) {
            this.setState({ errormsg: err.message })
        }

        this.setState({ loading: false })
    };

    render() {
        return (
            <Layout>
                <h3>Create a Campaing</h3>
                
                <Form onSubmit={this.onSubmit} error={!!this.state.errormsg}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            label="wei" 
                            labelPosition="right" 
                            value={this.state.minimumContribution}
                            onChange={event => 
                                this.setState({ minimumContribution: event.target.value })
                            }
                        />
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errormsg} />
                    <Button loading={this.state.loading} primary>Create!</Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaingNew;