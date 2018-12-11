import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Select, Header, Modal } from 'semantic-ui-react';
import { withCookies, Cookies } from 'react-cookie';

import RequestedServiceItem from './RequestedServiceItem';
import CreateServiceCrowdfunding from '../CreateServiceCrowdfunding';

const urlForRequestedServices = crowdfundingId => `/api/crowdfundings/` + crowdfundingId + `/services_requested`;

class CrowdfundingOffers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            requestedServices: []
        }
        const { cookies } = this.props;
    }

    getRequestedServices() {
        fetch(urlForRequestedServices(this.props.crowdfundingId), {
            method: 'GET'
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({requestedServices: data});
                    })
            }
        });
    }

    componentDidMount() {
        this.getRequestedServices();
    }

    render() {
        let requestedServices;
        if(this.state.requestedServices) {
            requestedServices = this.state.requestedServices.map(requestedService => {
                return (
                    <RequestedServiceItem key={requestedService.title} requestedService={requestedService} crowdfundingId={this.props.crowdfundingId} crowdfundingCreatorId={this.props.crowdfundingCreatorId}/>
                );
            });
        }
        let createServices;
        if (this.props.userId == this.props.crowdfundingCreatorId)
            createServices = <Link to={`/crowdfunding/${this.props.crowdfundingId}/createservice`}>Create Service</Link>

        return (
            <Container>
                <h3 align="center">Services</h3>
                {requestedServices}
                {createServices}
            </Container>
        );
    }
}

export default CrowdfundingOffers;
