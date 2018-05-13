import React, { Component } from 'react';
import '../css/common.css';
import { Link } from 'react-router-dom';
import { Container, Button, Select} from 'semantic-ui-react';

import RequestedServiceItem from '../components/RequestedServiceItem';

// const urlForRequestedServices = crowdfundingId => `http://localhost:3001/api/crowdfundings/${crowdfundingId}}/services_requested`;
const urlForRequestedServices = crowdfundingId => `http://localhost:3001/api/crowdfundings/` + crowdfundingId + `/services_requested`;

class CrowdfundingOffers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crowdfundingId: this.props.match.params.crowdfunding_id,
            requestedServices: []
        }
    }

    getRequestedServices() {
        fetch(urlForRequestedServices(this.state.crowdfundingId), {
            // header: { 'token': 'veeebebeb' },
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
                    <RequestedServiceItem key={requestedService.title} requestedService={requestedService} />
                );
            });
        }
        return (
            <Container>
                <h3>Requested Services</h3>
                {requestedServices}
            </Container>
        );
    }
}

export default CrowdfundingOffers;
