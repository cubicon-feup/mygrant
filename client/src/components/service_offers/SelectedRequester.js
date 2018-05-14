import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';

class SelectedRequester extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: 0
        }
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({rating: event.target.value});
    }

    render() {
        let rate;
        if(new Date() < new Date(this.props.serviceInstanceInfo.date_scheduled)) {
            // Service is not yet done.
            rate = 
                <Container>
                    <label>Scheduled date: {this.props.serviceInstanceInfo.date_scheduled}</label>
                </Container>
        } else if(!this.props.serviceInstanceInfo.requester_rating) {
            // Service may be done, so creator can rate the requester.
            rate = 
                <Container>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <input type="number" value={this.state.rating} onChange={this.handleChange.bind(this)} min="1" max="3" />
                        <input type="submit" value="Rate" />
                    </form>
                </Container>
        } else {
            // Creator has already rated the requester.
            rate =
                <Container>
                    <label>Rated: {this.props.serviceInstanceInfo.requester_rating}</label>
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
