import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Container, Header, Grid, Divider, Image, Icon, Item, Rating, Loader,Progress, Responsive, Form} from 'semantic-ui-react';

import Crowdfunding from '../components/dashboard/Crowdfunding';

const urlGetMygrantBalance = `/api/comments/mygrant_balance`;
const urlGetUserCrowdfundings = `/api/comments/crowdfundings`;

class Dashboard extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = {
            mygrant_balance: 0,
            crowdfundings: []
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
    getServicesProvidedToRate() {

    }

    // Services that the user was a candidate and was accepted.
    getServicesRequestedToRate() {

    }

    getCandidatesToServices() {

    }

    render() {
        let crowdfundings;
        if(this.state.crowdfundings) {
            crowdfundings = this.state.crowdfundings.map(crowdfunding => {
                return <Crowdfunding key={crowdfunding.id} crowdfunding={crowdfunding} />
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