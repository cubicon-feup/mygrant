import React, { Component } from 'react';
import { Container} from 'semantic-ui-react';

import Candidate from './Candidate';
import SelectedRequester from './SelectedRequester';

const urlGetCandidates = `http://localhost:3001/api/services/1002/offers`;
const urlRejectCandidate = `http://localhost:3001/api/services/1002/offers/decline`;
const urlAcceptCandidate = `http://localhost:3001/api/services/1002/offers/accept`;
const urlGetAcceptedRequester = `http://localhost:3001/api/services/1002/instance/partner`;

class RequestedServiceItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidates: [],
            selectedRequester: {}
        }
    }

    componentDidMount() {
        this.getCandidates();
    }

    getCandidates() {
        fetch(urlGetCandidates, {
            method: 'GET'
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({candidates: data});
                        if(this.state.candidates.length <= 0)
                        this.getSelectedRequester();
                    })
            }
        })
    }

    getSelectedRequester() {
        fetch(urlGetAcceptedRequester, {
            method: 'GET',
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({selectedRequester: data});
                    })
            }
        })
    }

    acceptCandidate(candidate) {
        this.setState({candidates: []});
        this.setState({selectedRequester: candidate});
        fetch(urlAcceptCandidate, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                partner_id: candidate.requester_id,
                date_scheduled: new Date('2018-05-13 20:00:00')
                // TODO: find a calendar framework;
            })
        })
    }

    rejectCandidate(candidate) {
        let updatedCandidates = this.state.candidates;
        let indexToRemove = updatedCandidates.indexOf(candidate);
        if(indexToRemove >= 0) {
            updatedCandidates.splice(indexToRemove, 1);
            this.setState({candidates: updatedCandidates});
            fetch(urlRejectCandidate, {
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
        } else if(this.state.selectedRequester)
            candidates = <SelectedRequester selectedRequester={this.state.selectedRequester} />
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
