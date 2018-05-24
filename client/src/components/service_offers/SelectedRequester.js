import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

const urlRate = serviceId => '/api/services/instance/' + serviceId;
const Role = require('../../Role').role;

class SelectedRequester extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toRate: 0,
        }
    }

    // TODO: send rate post (not using the real url now).
    handleSubmit(event) {
        let body;
        if(this.props.role === Role.CROWDFUNDING_CREATOR)
            body: JSON.stringify({
                rating: this.state.toRate,
                crowdfunding_id: this.props.crowdfundingId
            });
        else if(this.props.role === Role.SERVICE_PARTNER)
            body: JSON.stringify({
                rating: this.state.toRate,
            });

        const { cookies } = this.props;
        fetch(urlRate(this.props.serviceId), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.get('id_token')}`,
            },
            body: body
        });
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({toRate: event.target.value});
    }

    render() {
        let scheduledDate = null;
        let creatorRating = null;
        let partnerRating = null;
        if(this.props.role !== Role.NONE) {
            if(new Date() < new Date(this.props.serviceInstanceInfo.date_scheduled)) {
                // Service is not yet done.
                scheduledDate = 
                    <Container>
                        <label>Scheduled date: {this.props.serviceInstanceInfo.date_scheduled}</label>
                    </Container>
            } else {
                if(this.props.role === Role.CROWDFUNDING_CREATOR && !this.props.serviceInstanceInfo.creator_rating) {
                    // Service may be done, so ratings can be set.
                    creatorRating = 
                        <Container>
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <input type="number" value={this.state.toRate} onChange={this.handleChange.bind(this)} min="1" max="3" />
                                <input type="submit" value="Rate Service Partner" />
                            </form>
                        </Container>
                } else if (this.props.role === Role.SERVICE_PARTNER && !this.props.serviceInstanceInfo.partner_rating){
                    partnerRating = 
                        <Container>
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <input type="number" value={this.state.toRate} onChange={this.handleChange.bind(this)} min="1" max="3" />
                                <input type="submit" value="Rate Service Creator" />
                            </form>
                        </Container>
                }

                if(this.props.serviceInstanceInfo.partner_rating)
                    partnerRating =
                        <Container>
                            <label> Partner rating: {this.props.serviceInstanceInfo.partner_rating}</label>
                        </Container>
                if(this.props.serviceInstanceInfo.creator_rating)
                    creatorRating =
                        <Container>
                            <label>Creator rating: {this.props.serviceInstanceInfo.creator_rating}</label>
                        </Container>
            }   
        }

        return (
            <Container>
                <label>Selected requester: </label>
                <a href="#">{this.props.serviceInstanceInfo.requester_name}</a>
                {scheduledDate}
                {creatorRating}
                {partnerRating}
            </Container>
        );
    }
}

export default withCookies(SelectedRequester);
