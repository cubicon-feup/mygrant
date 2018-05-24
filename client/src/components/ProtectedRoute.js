import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class ProtectedRoute extends Component {
    static propTypes = {
        component: instanceOf(Component).isRequired,
        cookies: instanceOf(Cookies).isRequired
    };

    render() {
        const { cookies } = this.props;
        const { component, ...rest } = this.props;
        const CustomComponent = component;
        const idToken = cookies.get('id_token');

        // Check if the id_token is set - meaning the user is logged in
        return <Route
            {...rest}
            render={
                function(props) {
                    return idToken ? <CustomComponent {...props} /> : <Redirect to={{ pathname: '/login' }} />;
                }
            }
        />;
    }
}

export default withCookies(ProtectedRoute);
