import React, { Component } from 'react';
import { Container} from 'semantic-ui-react';

import Candidate from './Candidate';
import SelectedRequester from './SelectedRequester';

const urlGetCandidates = serviceId => `http://localhost:3001/api/services/` + serviceId + `/offers`;
const urlRejectCandidate = serviceId => `http://localhost:3001/api/services/`+ serviceId + `/offers/decline`;
const urlAcceptCandidate = serviceId => `http://localhost:3001/api/services/` + serviceId + `/offers/accept`;
const urlGetServiceInstanceInfo = serviceId => 'http://localhost:3001/api/services/' + serviceId + `/instance`;

class RequestedServiceItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceId: this.props.requestedService.id,
            candidates: [],
            serviceInstanceInfo: {}
        }
    }

    componentDidMount() {
        this.getCandidates();
    }

    getCandidates() {
        fetch(urlGetCandidates(this.state.serviceId), {
            method: 'GET'
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({candidates: data});
                        if(this.state.candidates.length <= 0)
                            this.getServiceInstanceInfo();
                    })
            }
        })
    }

    getServiceInstanceInfo() {
        fetch(urlGetServiceInstanceInfo(this.state.serviceId), {
            method: 'GET',
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({serviceInstanceInfo: data});
                    })
            }
        })
    }

    acceptCandidate(candidate) {
        this.setState({candidates: []});

        // TODO: test if state applies.
        let serviceInstanceInfo = {
            date_scheduled: new Date('2018-05-15 20:00:00'),
            // TODO: find a calendar framework;
            // TODO: can only schedule after today.
            requester_id: candidate.requester_id,
            requester_name: candidate.requester_name,
            creator_rating: null,
            requester_rating: null
        }
        this.setState({serviceInstanceInfo: serviceInstanceInfo});

        fetch(urlAcceptCandidate(this.state.serviceId), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                partner_id: serviceInstanceInfo.requester_id,
                date_scheduled: serviceInstanceInfo.date_scheduled
            })
        })
    }

    rejectCandidate(candidate) {
        let updatedCandidates = this.state.candidates;
        let indexToRemove = updatedCandidates.indexOf(candidate);
        if(indexToRemove >= 0) {
            updatedCandidates.splice(indexToRemove, 1);
            this.setState({candidates: updatedCandidates});
            fetch(urlRejectCandidate(this.state.serviceId), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    partner_id: candidate.requester_id
                })
            });
        }
    }

    render() {
        let candidates;
        if(this.state.candidates.length > 0) {
            candidates = this.state.candidates.map(candidate => {
                return (
                    <Candidate key={candidate.requester_id} candidate={candidate} onAccept={this.acceptCandidate.bind(this)} onReject={this.rejectCandidate.bind(this)} />
                )
            });
        } else if(this.state.serviceInstanceInfo)
            candidates = <SelectedRequester serviceInstanceInfo={this.state.serviceInstanceInfo} />
        return (
            <Container>
                <p>
                    <label>Title: </label>
                    {this.props.requestedService.title}
                </p>
                <p>
                    <label>Description: </label>
                    {this.props.requestedService.mygrant_value}
                </p>
                <p>
                    <label>Category: </label>
                    {this.props.requestedService.category}
                </p>
                {candidates}
            </Container>
        );
    }
}

export default RequestedServiceItem;
