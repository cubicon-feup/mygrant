import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

class SelectedRequester extends Component {

    constructor(props) {
        super(props);
        console.log(this.props.selectedRequester);
    }

    render() {
        return (
            <Container>
                <label>Selected requester: </label>
                <a href="#">{this.props.selectedRequester.requester_name}</a>
            </Container>
        );
    }
}

export default SelectedRequester;
