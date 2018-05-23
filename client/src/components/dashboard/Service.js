import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Container, Button, Card, Image, Form } from 'semantic-ui-react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import Candidate from './Candidate';

const urlGetServiceCandidates = serviceId => `/api/services/${serviceId}/offers`;
const urlAcceptCandidate = serviceId => `/api/services/${serviceId}/offers/accept`;
const urlRejectCandidate = serviceId => `/api/services/${serviceId}/offers/decline`;
const urlGetServiceInstanceInfo = serviceId => `/api/services/${serviceId}/instance`;
const urlRateService = serviceId => `/api/services/instance/${serviceId}`;
const Role = require('../../Role').role;

class Service extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            service: this.props.service,
            serviceInstance: null,
            candidates: [],
            rate: null,
            role: Role.AUTHENTICATED
        }
    }
    
    componentDidMount() {
        if(this.state.type === 'CROWDFUNDING')  // PARTNED, CROWDFUNDING
            this.getCandidates();
        else if(this.state.type === 'PARTNED') {
            this.setState({serviceInstance: this.props.service});
        }
    }

    getCandidates() {
       const { cookies } = this.props;
        fetch(urlGetServiceCandidates(this.state.service.id), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        if(data.length > 0)
                            this.setState({candidates: data});
                        else this.getServiceInstanceInfo();
                    })
            }
        })
    }

    // When a service already has someone assigned, we retrieve the instance information.
    getServiceInstanceInfo() {
        const { cookies } = this.props;
        fetch(urlGetServiceInstanceInfo(this.state.service.id), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({serviceInstance: data});
                    })
            }
        })
    }

    acceptCandidate(candidate) {
        const { cookies } = this.props;
        fetch(urlAcceptCandidate(this.state.service.id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.get('id_token')}`
            },
            body: JSON.stringify({
                partner_id: candidate.requester_id,
                date_scheduled: candidate.date_proposed
            })
        }).then(res => {
            if(res.status === 200) {
                this.setState({candidates: []});
                this.getServiceInstanceInfo()
            }
        });
    }

    rejectCandidate(candidate) {
        const { cookies } = this.props;
        fetch(urlRejectCandidate(this.state.service.id), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.get('id_token')}`
            },
            body: JSON.stringify({
                partner_id: candidate.requester_id
            })
        }).then(res => {
            if(res.status === 200) {
                let updatedCandidates = this.state.candidates;
                let indexToRemove = updatedCandidates.indexOf(candidate);
                if(indexToRemove >= 0) {
                    updatedCandidates.splice(indexToRemove, 1);
                    this.setState({candidates: updatedCandidates});
                }
            }
        });
    }

    // EVENT HANDLERS
    // =============================================================

    handleNumberChange = (e, { name, value }) => {
        var newValue = parseInt(value, 10);
        this.setState({ [name]: newValue });
    };

    handleSubmit = e => {
        const { cookies } = this.props;
        e.preventDefault();

        let body;
        if(this.state.type === 'CROWDFUNDING')
            body = JSON.stringify({
                rating: this.state.rate,
                crowdfunding_id: this.props.crowdfundingId
            });
        else body = JSON.stringify({
            rating: this.state.rate
        });

        fetch(urlRateService(this.state.serviceInstance.service_instance_id), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.get('id_token')}`
            },
            body: body
        }).then(res => {
            if(res.status === 200) {
                console.log("returned")
            }
        })
    };

    render() {
        let candidates = null, serviceInstance = null;
        if(this.state.candidates.length > 0) {
            candidates = this.state.candidates.map(candidate => {
                return (
                    <Card>
                        <Card.Content>
                            <Card.Header><Link to={`/user/${candidate.requester_id}`}>{candidate.requester_name}</Link></Card.Header>
                            <Card.Description>
                                <p>Date proposed: {candidate.date_proposed}</p>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <div className='ui two buttons'>
                                <Button basic color='green' onClick={this.acceptCandidate.bind(this, candidate)}>Approve</Button>
                                <Button basic color='red' onClick={this.rejectCandidate.bind(this, candidate)}>Decline</Button>
                            </div>
                        </Card.Content>
                    </Card>
                )
            })
        } else if(this.state.serviceInstance) {
            const { cookies } = this.props;
            let rate;

            console.log(this.state.serviceInstance)
            if(cookies.get('user_id') == this.state.serviceInstance.partner_id) {   // If the user is the partner.
                if(this.state.serviceInstance.partner_rating)
                    rate = <p>Rated: {this.state.serviceInstance.partner_rating}</p>
                else if(new Date() > new Date(this.state.serviceInstance.date_scheduled))
                    rate =
                        <Form className="mygrant-createform" method="POST" onSubmit={this.handleSubmit}>
                            <Form.Input
                                placeholder="Rate"
                                name="rate"
                                type="number"
                                value={this.state.rate}
                                onChange={this.handleNumberChange}
                                required
                            />
                            <Form.Button id="dark-button" content="Submit" />
                        </Form>

                serviceInstance =
                    <Card>
                        <Card.Content>
                            <Card.Header>Requester: <Link to={`/user/${this.state.serviceInstance.creator_id}`}>{this.state.serviceInstance.creator_name}</Link></Card.Header>
                            <Card.Description>
                                <p>Date scheduled: {this.state.serviceInstance.date_scheduled}</p>
                                {rate}
                            </Card.Description>
                        </Card.Content>
                    </Card>

            } else if(cookies.get('user_id') != this.state.serviceInstance.partner_id) {   // If the user is the crowdfunding creator.
                if(this.state.serviceInstance.creator_rating)   // If the user has already rated the partner.
                    rate = <p>Rated: {this.state.serviceInstance.creator_rating}</p>
                else if(new Date() > new Date(this.state.serviceInstance.date_scheduled))
                    rate =
                        <Form className="mygrant-createform" method="POST" onSubmit={this.handleSubmit}>
                            <Form.Input
                                placeholder="Rate"
                                name="rate"
                                type="number"
                                value={this.state.rate}
                                onChange={this.handleNumberChange}
                                required
                            />
                            <Form.Button id="dark-button" content="Submit" />
                        </Form>

                serviceInstance =
                    <Card>
                        <Card.Content>
                            <Card.Header>Accepted: <Link to={`/user/${this.state.serviceInstance.partner_id}`}>{this.state.serviceInstance.partner_name}</Link></Card.Header>
                            <Card.Description>
                                <p>Date scheduled: {this.state.serviceInstance.date_scheduled}</p>
                                {rate}
                            </Card.Description>
                        </Card.Content>
                    </Card>
            }

        }

        return (
            <Container>
                <h3><Link to={`/service/${this.state.service.id}`}>{this.state.service.title}</Link></h3>
                <Card.Group>
                    {candidates}
                    {serviceInstance}
                </Card.Group>
            </Container>
        )
    }
}

export default withCookies(Service);