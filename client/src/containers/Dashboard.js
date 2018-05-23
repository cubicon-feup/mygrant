import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Container, Header, Grid, Divider, Image, Icon, Item, Rating, Loader,Progress, Responsive, Form} from 'semantic-ui-react';

import Crowdfunding from '../components/dashboard/Crowdfunding';

const urlGetMygrantBalance = `/api/comments/mygrant_balance`;
// const urlGetCandidates = serviceId => `/api/services/${serviceId}/offers`;
const urlGetUserCrowdfundings = `/api/comments/crowdfundings`;
const urlGetCrowdfundingServices = crowdfundingId => `/api/crowdfundings/${crowdfundingId}/services_requested`;
const urlGetServiceCandidates = serviceId => `/api/services/${serviceId}/offers`;

class Dashboard extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = {
            mygrant_balance: 0,
            candidates: [],
            crowdfundings: [],
            crowdfundingsServices: [],
            candidates: []
        }

    }

    componentDidMount() {
        this.getMygrantBalance();
        this.getUserCrowdfundings();
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

    // Get crowdfundings, services and candidates.
    // STARTING HIERARCHICAL FETCHING!

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
                        for(let i = 0; i < this.state.crowdfundings.length; i++) {
                            this.getCrowdfundingServices(this.state.crowdfundings[i].id);
                        }
                    })
            }
        })
    }

    getCrowdfundingServices(crowdfundingId) {
        const { cookies } = this.props;
        fetch(urlGetCrowdfundingServices(crowdfundingId), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        let crowdfundingsServices = this.state.crowdfundingsServices;
                        for(let i = 0; i < data.length; i++) {
                            let service = data[i];
                            service.crowdfunding_id = crowdfundingId;
                            crowdfundingsServices.push(service);
                            this.getServiceCandidates(data[i].id);
                        }
                        this.setState({crowdfundingsServices: crowdfundingsServices});
                    })
            }
        })
    }

    getServiceCandidates(serviceId) {
        const { cookies } = this.props;
        fetch(urlGetServiceCandidates(serviceId), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        let candidates = this.state.candidates;
                        for(let i = 0; i < data.length; i++) {
                            let candidate = data[i];
                            candidate.service_id = serviceId;
                            candidates.push(candidate);
                        }
                        this.setState({candidates: candidates});
                        // console.log(this.state)
                    })
            }
        })
    }

    // FINISHED HIERARCHICAL FETCHING.

    // FIXME: not using, can remove.
    /*getCrowdfundingsAndServices() {
        const { cookies } = this.props;
        fetch(urlGetCrowdfundingsAndServices, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        
                    })
            }
        })
    }*/

    // Crowdfundings that the user supported.
    getCrowdfundingsToRate() {

    }

    // Services that the user provided.
    getServicesProvidedToRate() {

    }

    // Services that the user was a candidate and was accepted.
    getServicesRequestedToRate() {

    }

    /*getCandidatesToCrowdfundingServices() {
        const { cookies } = this.props;
        fetch(urlGetCandidates(1003), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        console.log(data);
                        this.setState({candidates: data});
                    })
            }
        })
    }*/

    getCandidatesToServices() {

    }

    a() {
        let crowdfundings;
        for(let i = 0; i < this.state.crowdfundings.length; i++) {
            let crowdfunding = 
                <Container>
                    <p>{this.state.crowdfundings[i].title}</p>
                </Container>
            for(let j = 0; j < this.state.crowdfundingsServices.length; j++) {

            }
        }
    }

    render() {
        let candidates;
        if(this.state.candidates.length > 0) {
            candidates = this.state.candidates.map(candidate => {
                return (
                    <p>{candidate.requester_name}</p>
                )
            })
        }

        let crowdfundings;
        if(this.state.crowdfundings) {
            crowdfundings = this.state.crowdfundings.map(crowdfunding => {
                return <Crowdfunding crowdfunding={crowdfunding} />
            })
        } else crowdfundings = 'Nothing yet.';

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
                
                <h2>Crowdfundings</h2>
                {crowdfundings}

            </Container>
        )
    }
}

export default withCookies(Dashboard);