import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';

class Inbox extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props)

        this.state = { messages: [] };
    }

    render() {
        return (
            <div>
            </div>
        );
    }
}

export default withCookies(Inbox);
