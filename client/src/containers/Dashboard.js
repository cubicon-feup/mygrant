import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Container, Header, Grid, Divider, Image, Icon, Item, Rating, Loader,Progress, Responsive, Form, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import '../css/Dashboard.css';

import Service from '../components/dashboard/Service';
import Crowdfunding from '../components/dashboard/Crowdfunding';
import DonatedCrowdfunding from '../components/dashboard/DonatedCrowdfunding';
import { MygrantDividerLeft, MygrantDividerRight } from '../components/Common';

const urlGetMygrantBalance = `/api/comments/mygrant_balance`;
const urlGetMyServices = `/api/comments/my_services`;
const urlGetPartnerServices = `/api/comments/partned_services`;
const urlGetUserCrowdfundings = `/api/comments/crowdfundings`;
const urlGetDonatedCrowdfundings = `/api/comments/donated_crowdfundings`;

class Dashboard extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = {
            mygrant_balance: 0,
            myServices: [],
            partnedServices: [],
            crowdfundings: [],
            donatedCrowdfundings: []
        }
    }

    componentDidMount() {
        this.getMygrantBalance();
        this.getMyServices();
        this.getPartnedServices();
        this.getUserCrowdfundings();
        this.getDonatedCrowdfundings();
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
                        this.setState({mygrant_balance: data.mygrant_balance});
                    })
            }
        })
    }

    getMyServices() {
        const { cookies } = this.props;
        fetch(urlGetMyServices, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({myServices: data.data});
                    })
            }
        })
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

    getDonatedCrowdfundings() {
        const { cookies } = this.props;
        fetch(urlGetDonatedCrowdfundings, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        console.log(data);
                        this.setState({donatedCrowdfundings: data.data});
                        console.log(this.state.donatedCrowdfundings);
                    })
            }
        })
    }

    // Services that the user was a candidate and was accepted.
    // TODO: last to do.
    getServicesRequestedToRate() {

    }

    render() {
        let myServices;
        if(this.state.myServices.length > 0) {
            myServices = this.state.myServices.map(myService => {
                return (
                    <Container fluid className="service-container">
                        <Service key={myService.id} service={myService} type={'MY_SERVICES'} />
                    </Container>
                );
            })
        } else myServices = 'No services.';

        let partnedServices;
        if(this.state.partnedServices.length > 0) {
            partnedServices = this.state.partnedServices.map(partnedService => {
                return (
                    <Service key={partnedService.service_id} service={partnedService} type={'PARTNED'}/>
                );
            })
        } else partnedServices = 'Nothing yet.';

        let crowdfundings;
        if(this.state.crowdfundings.length > 0) {
            crowdfundings = this.state.crowdfundings.map(crowdfunding => {
                return (
                    <Container fluid className="crowdfunding-container">
                        <Crowdfunding key={crowdfunding.id} crowdfunding={crowdfunding} />
                    </Container>
                );
            })
        } else crowdfundings = 'Nothing yet.';

        let donatedCrowdfundings;
        if(this.state.donatedCrowdfundings.length > 0) {
            donatedCrowdfundings = this.state.donatedCrowdfundings.map(donatedCrowdfunding => {
                return (
                    <Card>
                        <Card.Content>
                            <Card.Header>Crowdfunding: <Link to={`/user/${donatedCrowdfunding.crowdfunding_id}`}>{donatedCrowdfunding.crowdfunding_title}</Link></Card.Header>
                            <Card.Description>
                                <p>Amount: {donatedCrowdfunding.amount}</p>
                            </Card.Description>
                            {/*Ainda faltam os botoes para dar rate.*/}
                        </Card.Content>
                    </Card>
                )
                return <DonatedCrowdfunding crowdfunding={donatedCrowdfunding}/>
            })
        } else donatedCrowdfundings = 'Nothing yet.';

        return (
            <Container fluid id="dashboard_base_container" className="main-container">
                <Container>
                    <div id="balance">
                        <h3 id="balance_label">Mygrant Balance</h3>
                        <h1 id="mygrant_balance">{this.state.mygrant_balance}</h1>
                    </div>
                    <h2>My Services</h2>
                </Container>
                <Responsive as={MygrantDividerLeft} minWidth={768} className="intro-divider" color="purple" />
                <Container>
                    {myServices}

                    <h2>Partned Services</h2>
                </Container>
                <Responsive as={MygrantDividerRight} minWidth={768} className="intro-divider" color="green" />
                <Container>
                    <Card.Group Stacked>
                    {partnedServices}
                    </Card.Group>

                    <h2>Crowdfundings</h2>
                </Container>
                <Responsive as={MygrantDividerLeft} minWidth={768} className="intro-divider" color="purple" />
                <Container>
                    {crowdfundings}

                    <h2>Donated Crowdfundings</h2>
                </Container>
                <Responsive as={MygrantDividerRight} minWidth={768} className="intro-divider" color="green" />
                <Container>
                    {donatedCrowdfundings}
                </Container>
            </Container>
        )
    }
}

export default withCookies(Dashboard);
