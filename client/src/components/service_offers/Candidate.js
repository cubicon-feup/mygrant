import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';

class Candidate extends Component {

    render() {
        return (
            <Container>
                <a href={"/user/"+this.props.candidate.requester_id}>{this.props.candidate.requester_name}</a>
                <Button onClick={this.props.onAccept.bind(this, this.props.candidate)}>Accept</Button>
                <Button onClick={this.props.onReject.bind(this, this.props.candidate)}>Reject</Button>
                <Button>Go to messages</Button>
            </Container>
        );
    }
}

export default Candidate;
