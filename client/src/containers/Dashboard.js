import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Container, Header, Grid, Divider, Image, Icon, Item, Rating, Loader,Progress, Responsive, Form} from 'semantic-ui-react';

import Crowdfunding from '../components/dashboard/Crowdfunding';
import Service from '../components/dashboard/Service'; 

const urlGetMygrantBalance = `/api/comments/mygrant_balance`;
const urlGetUserCrowdfundings = `/api/comments/crowdfundings`;
const urlGetPartnerServices = `/api/comments/partned_services`;

class Dashboard extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = {
            mygrant_balance: 0,
            crowdfundings: [],
            partnedServices: []
        }

    }

    componentDidMount() {
        this.getMygrantBalance();
        this.getUserCrowdfundings();
        this.getPartnedServices();
    }

    getMygrantBalance() {
        const { cookies } = this.props;
        fetch(urlGetMygrantBalance, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        // TODO: not saving the value, why?
                        this.setState({mygrant_balance: data.mygrant_balance});
                    })
            }
        })
    }

    getUserCrowdfundings() {
        const { cookies } = this.props;
        fetch(urlGetUserCrowdfundings, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({crowdfundings: data.data})
                    })
            }
        })
    }

    // Crowdfundings that the user supported.
    getCrowdfundingsToRate() {

    }

    // Services that the user provided.
    getPartnedServices() {
        const { cookies } = this.props;
        fetch(urlGetPartnerServices, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({partnedServices: data.data});
                        console.log(this.state.partnedServices)
                    })
            }
        })
    }

    // Services that the user was a candidate and was accepted.
    // TODO: last to do.
    getServicesRequestedToRate() {

    }

    render() {
        let crowdfundings;
        if(this.state.crowdfundings.length > 0) {
            crowdfundings = this.state.crowdfundings.map(crowdfunding => {
                return <Crowdfunding key={crowdfunding.id} crowdfunding={crowdfunding} />
            })
        } else crowdfundings = 'Nothing yet.';

        let partnedServices;
        if(this.state.partnedServices.length > 0) {
            partnedServices = this.state.partnedServices.map(partnedService => {
                return <Service key={partnedService.service_id} service={partnedService} type={'PARTNED'}/>
            })
        } else partnedServices = 'Nothing yet.';

        return (
            <Container>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <p>Mygrant Balance: {this.state.mygrant_balance}</p>
                <p>Ratings to give </p>
                
                <h2>Partned Services</h2>
                {partnedServices}

                <h2>Crowdfundings</h2>
                {crowdfundings}

            </Container>
        )
    }
}

export default withCookies(Dashboard);