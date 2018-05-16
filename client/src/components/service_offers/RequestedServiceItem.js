import React, { Component } from 'react';
import { Container} from 'semantic-ui-react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import Candidate from './Candidate';
import SelectedRequester from './SelectedRequester';

const apiPath = require('../../config').apiPath;
const urlGetCandidates = serviceId => apiPath + `/services/` + serviceId + `/offers`;
const urlRejectCandidate = serviceId => apiPath + `/services/`+ serviceId + `/offers/decline`;
const urlAcceptCandidate = serviceId => apiPath + `/services/` + serviceId + `/offers/accept`;
const urlGetServiceInstanceInfo = serviceId => apiPath + '/services/' + serviceId + `/instance`;
const urlIsOwnerOrPartner = serviceId => '/api/services/' + serviceId + `/is_owner_or_partner`;

class RequestedServiceItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceId: this.props.requestedService.id,
            candidates: [],
            serviceInstanceInfo: {},
            ownerType: 'none'
        }
    }

    componentDidMount() {
        this.getCandidates();
        this.getOwnerType();
    }

    getOwnerType() {
        const { cookies } = this.props;
        fetch(urlIsOwnerOrPartner(this.state.serviceId), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,   
            }
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({ownerType: data.type});
                    })
            }
        })
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
                        console.log(this.state.serviceInstanceInfo)
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
        if(this.state.candidates.length > 0 && this.props.isOwner) {
            candidates = this.state.candidates.map(candidate => {
                return (
                    <Candidate key={candidate.requester_id} candidate={candidate} onAccept={this.acceptCandidate.bind(this)} onReject={this.rejectCandidate.bind(this)} />
                )
            });
        }  else candidates = null;
        
        let selectedRequester;
        if(this.state.serviceInstanceInfo)
            selectedRequester = <SelectedRequester serviceInstanceInfo={this.state.serviceInstanceInfo} serviceId={this.state.serviceId} ownerType={this.state.ownerType}/>
        else selectedRequester = null;
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
                {selectedRequester}
            </Container>
        );
    }
}

export default withCookies(RequestedServiceItem);
