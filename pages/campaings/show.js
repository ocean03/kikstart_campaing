import React, { Component } from 'react';
import { Card, Grid, Button, GridRow } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaing from '../../ethereum/campaing';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class  CampaingShow extends Component {
    static async getInitialProps(props) {
        const campaing = Campaing(props.query.address);

        const summery = await campaing.methods.getSummery().call();

        return {
            address: props.query.address,
            minimumContribution: summery[0],
            balance: summery[1],
            requestsCount: summery[2],
            approversCount: summery[3],
            manager: summery[4]
        };
    }

    renderCards() {
        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = thois.props;

        const items = [
            {
                header: manager,
                meta: 'Address of manager',
                description: 'The manager created this campaing and can create request to withdraw mony',
                style: { overflowWrape: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute this much wei to become a approver',
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw mony from the contract. Requests must be approved by the approvers',
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of approvers who have alrady donated to this campaing',
            },  
            {
                header: web3.utils.fromwei(balance, 'ether'),
                meta: 'Campaing Balance (Ethere)',
                description: 'The balance is how much mony this campaing has left to spand.',
            }
        ];

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <h3>Campaing Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

                        <Grid.Column width={6}>
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaings/${this.props.address}/reqests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CampaingShow;