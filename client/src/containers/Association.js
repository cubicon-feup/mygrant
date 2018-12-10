import React, { Component } from 'react';
import '../css/Signup.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Container } from 'semantic-ui-react';

class Association extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        history: ReactRouterPropTypes.history.isRequired
    };

    render() {
        return (
            <Container className="main-container">
                <div><h1>Associations</h1></div>
            </Container>
        );
    }
}

export default withCookies(Association);
