import React, { Component } from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import SignUpInfo from '../containers/SignupInfo.js';

class ProtectedRoute extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    render() {
        const { cookies } = this.props;
        const { component } = this.props;
        return cookies.get('id_token') ? <Route component={component}/> : <Redirect to={{pathname: '/login'}} />
    }
}

export default withCookies(ProtectedRoute);
