import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';

const urlRate = serviceId => 'http://localhost:3001/api/crowdfundings/:crowdfunding_id/rating' + serviceId;

class SelectedRequester extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toRate: 0,
            creatorRating: this.props.serviceInstanceInfo.creator_rating
        }
    }

    // TODO: send rate post (not using the real url now).
    handleSubmit(event) {
        this.setState({creatorRating: this.state.toRate});
        fetch(urlRate(this.props.serviceId), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + 'aqwswqdx'     // TODO: correct token.
            },
            body: JSON.stringify({
                rating: this.state.creatorRating
            })
        });
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({toRate: event.target.value});
    }

    render() {
        let rate;
        if(new Date() < new Date(this.props.serviceInstanceInfo.date_scheduled)) {
            // Service is not yet done.
            rate = 
                <Container>
                    <label>Scheduled date: {this.props.serviceInstanceInfo.date_scheduled}</label>
                </Container>
        } else if(!this.state.creatorRating) {
            // Service may be done, so creator can rate the requester.
            rate = 
                <Container>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <input type="number" value={this.state.toRate} onChange={this.handleChange.bind(this)} min="1" max="3" />
                        <input type="submit" value="Rate" />
                    </form>
                </Container>
        } else {
            // Creator has already rated the requester.
            rate =
                <Container>
                    <label>Rated: {this.state.creatorRating}</label>
                </Container>
        }
        return (
            <Container>
                <label>Selected requester: </label>
                <a href="#">{this.props.serviceInstanceInfo.requester_name}</a>
                {rate}
            </Container>
        );
    }
}

export default SelectedRequester;
