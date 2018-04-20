import React, { Component } from 'react';
import '../css/App.css';

import { Container, Header, Segment } from 'semantic-ui-react';

const urlForUser = id => `http://localhost:3001/api/users/${id}`;

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offers: [{}],
            request: '',
            requestFailed: false
        };
    }

    componentDidMount() {
        fetch(urlForUser(this.props.match.params.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState(result.data);
                },
                () => {
                    console.log('ERROR');
                }
            );
    }

    render() {
        return (
            <Container className="main-container">
                <Segment>
                    <Header as="h1">{this.state.full_name}</Header>
                    <p>{this.state.city}</p>
                    <p>{this.state.country}</p>
                    <p>{this.state.level}</p>
                    <p>{this.state.high_level}</p>
                </Segment>
            </Container>
        );
    }
}

export default User;
