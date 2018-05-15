import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';

class Donator extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <p>
                    <a href="#">{this.props.donator.donator_name}</a> donated <strong>{this.props.donator.amount}</strong> mygrants</p>
                <p />
            </Container>
        )
    }
}

export default Donator;
