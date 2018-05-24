import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Container, Header, Grid, Divider, Image, Icon, Item, Rating, Loader,Progress, Responsive, Form} from 'semantic-ui-react';

import Service from './Service';

const urlGetCrowdfundingServices = crowdfundingId => `/api/crowdfundings/${crowdfundingId}/services_requested`;

class Crowdfunding extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = {
            crowdfunding: this.props.crowdfunding,
            services: []
        }
    }

    componentDidMount() {
        this.getCrowdfundingServices()
    }

    getCrowdfundingServices() {
        const { cookies } = this.props;
        fetch(urlGetCrowdfundingServices(this.state.crowdfunding.id), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({services: data});
                    })
            }
        })
    }

    render() {
        let services;
        if(this.state.services) {
            services = this.state.services.map(service => {
                return (
                    <Service key={service.id} service={service} crowdfundingId={this.state.crowdfunding.id} type={'CROWDFUNDING'}/>
                )
            })
        } else services = null;

        return (
            <Container>
                <h2>{this.state.crowdfunding.title}</h2>
                {services}
            </Container>
        )
    }
}

export default withCookies(Crowdfunding);