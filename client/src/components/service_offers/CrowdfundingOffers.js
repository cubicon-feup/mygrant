import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Select} from 'semantic-ui-react';

import RequestedServiceItem from './RequestedServiceItem';

const urlForRequestedServices = crowdfundingId => `http://localhost:3001/api/crowdfundings/` + crowdfundingId + `/services_requested`;

class CrowdfundingOffers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            requestedServices: []
        }
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
        return (
            <Container>
                <h3 align="center">Services</h3>
                {requestedServices}
            </Container>
        );
    }
}

export default CrowdfundingOffers;
