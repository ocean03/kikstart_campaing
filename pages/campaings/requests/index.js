import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaing from '../../../ethereum/campaing';
import RequestRow from '../../../components/RequestRow';
import { request } from 'https';

class RequestIndex extends Component {
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaing = Campaing(address);
        const requestCount = await campaing.methods.getRequestsCount().call();
        const approversCount = await campaing.methods.approversCount().call();

        const requests = await Promise.all(
            Array(requestCount)
                .fill()
                .map((element, index) => {
                    return campaing.methods.requests(index).call()
            })
        );

        return { address, requests, requestCount, approversCount };
    }

    renderRows() {
        return this.props.requests.map(( request, index) => {
            return <RequestRow 
                        key={index} 
                        id={index} 
                        request={request} 
                        address={this.props.address} 
                        approversCount={this.props.approversCount} 
                    />;
        });
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;

        return (
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaings/${this.props.address}/requests/new `}>
                    <a>
                        <Button primary floated="right" style={{ marginBottom: 10 }}>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approvel Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderRows()}</Body>
                </Table>
                <div>Found {this.props.methods.requestCount} requests.</div>
            </Layout>
        );
    }
}

export default RequestIndex;