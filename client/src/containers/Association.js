import React, { Component } from 'react';
import '../css/Signup.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Button, Container, Form, Header, Input, Modal, Message, Responsive } from 'semantic-ui-react';
import { MygrantDivider } from '../components/Common';
import PidgeonMaps from '../components/Map';
import SearchLocation from '../components/SearchLocation';

class Association extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        history: ReactRouterPropTypes.history.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            name: 'abcd',
            description: ''
          };
    }

    displayAssociation() {

    }

/*

        const data = {
            id: this.state.id,
            name: this.state.name,
            description: this.state.description
        };

        fetch('/api/associations/:id', {
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' },
            method: 'POST'
        }).then(res => {
            if (res.status === 201) {
                // User created - redirect to more info
                //this.props.history.push('/');
                console.log(data);
            } else if (res.status === 409) {
                // Email or phone already in use
                this.setState({
                    emailError: true,
                    errorMessage: 'email or phone already in use',
                    formError: true,
                    phoneError: true
                });
            }
        });
    }
*/

    render() {
        return (
            <div>
            <h1>{this.state.name}</h1>
                <Responsive as={'div'} maxWidth={768} >
                    <Container fluid className="signup-title-container" >
                        <Header as={'h1'}>{'create'.toLowerCase()}<br/>{'an account'.toLowerCase()}</Header>
                    </Container>
                </Responsive>
                <Responsive as={MygrantDivider} maxWidth={768} color="green" />
            </div>
        );
    }
}

export default withCookies(Association);
