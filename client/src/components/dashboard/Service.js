import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Container, Button, Card, Image } from 'semantic-ui-react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import Candidate from './Candidate';

const urlGetServiceCandidates = serviceId => `/api/services/${serviceId}/offers`;
const urlAcceptCandidate = serviceId => `/api/services/${serviceId}/offers/accept`;
const urlRejectCandidate = serviceId => `/api/services/${serviceId}/offers/decline`;
const urlGetServiceInstanceInfo = serviceId => `/api/services/${serviceId}/instance`;

class Service extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = {
            service: this.props.service,
            serviceInstance: {},
            candidates: []
        }
    }
    
    componentDidMount() {
        this.getCandidates()
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
                        console.log(data.length);
                        //if(data.length > 0)
                        this.setState({candidates: data});
                        //else this.getServiceInstanceInfo();
                    })
            }
        })
    }

    // When a service already has someone assigned, we retrieve the instance information.
    getServiceInstanceInfo() {
        const { cookies } = this.props;
        fetch(urlGetServiceInstanceInfo(this.state.service.id), {
            method: 'GET',
            Authorization: `Bearer ${cookies.get('id_token')}`
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
        fetch(urlAcceptCandidate(this.state.serviceId), {
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
            if(res.status === 200)
                this.setState({candidates: []});
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

    render() {
        let candidates;
        if(this.state.candidates.length > 0) {
            console.log("mais");
            candidates = this.state.candidates.map(candidate => {
                return (
                    <Card>
                        <Card.Content>
                            <Card.Header>{candidate.requester_name}</Card.Header>
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
        } else {
            candidates = null;
            console.log("menos");
        }

        return (
            <Container>
                <h3><Link to={`/service/${this.state.service.id}`}>{this.state.service.title}</Link></h3>
                <Card.Group>
                    {candidates}
                </Card.Group>
            </Container>
        )
    }
}

export default withCookies(Service);