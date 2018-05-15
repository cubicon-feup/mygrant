import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { Container } from 'semantic-ui-react';
import Post from '../components/Post';

class Blog extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    render() {
        return (
            <div>
                <Container className="main-container blog" >
                    <Post />
                </Container>
            </div>
        );
    }
}

export default withCookies(Blog);
