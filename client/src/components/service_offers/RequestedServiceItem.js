import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import Candidate from './Candidate';
import SelectedRequester from './SelectedRequester';
import ListService from '../ListService';

const apiPath = require('../../config').apiPath;
const urlGetCandidates = serviceId => apiPath + `/services/` + serviceId + `/offers`;
const urlRejectCandidate = serviceId => apiPath + `/services/`+ serviceId + `/offers/decline`;
const urlAcceptCandidate = serviceId => apiPath + `/services/` + serviceId + `/offers/accept`;
const urlGetServiceInstanceInfo = serviceId => apiPath + '/services/' + serviceId + `/instance`;
const Role = require('../../Role').role;

class RequestedServiceItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceId: this.props.requestedService.id,
            crowdfundingCreatorId: this.props.crowdfundingCreatorId,
            candidates: [],
            serviceInstanceInfo: {},
            role: Role.NONE
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
                        this.assignRole();
                    })
            }
        })
    }

    acceptCandidate(candidate) {
        this.setState({candidates: []});

        // TODO: test if state applies.
        let serviceInstanceInfo = {
            date_scheduled: new Date('2018-06-15 20:00:00'),
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

    assignRole() {
        const { cookies } = this.props;
        let userId = cookies.get('user_id');
        if(userId == this.state.crowdfundingCreatorId)
            this.setState({role: Role.CROWDFUNDING_CREATOR});
        else if (userId == this.state.serviceInstanceInfo.partner_id)
            this.setState({role: Role.SERVICE_PARTNER});
        else if (userId)
            this.setState({role: Role.AUTHENTICATED});
    }

    render() {
        let candidates;
        if(this.state.role === Role.CROWDFUNDING_CREATOR && this.state.candidates.length > 0) {
            candidates = this.state.candidates.map(candidate => {
                return (
                    <Candidate key={candidate.requester_id} candidate={candidate} onAccept={this.acceptCandidate.bind(this)} onReject={this.rejectCandidate.bind(this)} />
                )
            });
        }  else candidates = null;

        let selectedRequester;
        let candicateToPosition;
        if(this.state.serviceInstanceInfo)
            selectedRequester = <SelectedRequester serviceInstanceInfo={this.state.serviceInstanceInfo} serviceId={this.state.serviceId} crowdfundingId={this.props.crowdfundingId} role={this.state.role}/>
        else selectedRequester = null;
        return (
            <Container>
                <ListService crowdfunding={this.props.requestedService}/>
                {/*candidates}
                {selectedRequester*/}
                <Link to={"/service/" + this.props.requestedService.id}>{this.props.requestedService.title}</Link>
            </Container>
        );
    }
}

export default withCookies(RequestedServiceItem);
