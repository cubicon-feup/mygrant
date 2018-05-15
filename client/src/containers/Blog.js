import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { Container } from 'semantic-ui-react';

class Blog extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    render() {
        return (
            <div>
                <Container className="main-container blog" >
                </Container>
            </div>
        );
    }
}

export default withCookies(Blog);
