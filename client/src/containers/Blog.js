import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { Container, Segment } from 'semantic-ui-react';
import Post from '../components/Post';
import BlogHeader from '../components/BlogHeader';
import '../css/Blog.css';

class Blog extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    render() {
        return (
            <div>
                <Container className="main-container blog" >
                    <BlogHeader user={{
                        fullName: 'Kanye West',
                        id: 69,
                        pictureUrl: '/users/kwest.jpg'
                    }} />
                </Container>
            </div>
        );
    }
}

export default withCookies(Blog);
