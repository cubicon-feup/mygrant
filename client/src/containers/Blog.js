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
                <Segment.Group>
                    <Post
                        content={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum'}
                        likes={31}
                        datePosted={'15:00'}
                        user={{
                            fullName: 'Kanye West',
                            id: 69,
                            pictureUrl: '/users/kwest.jpg'
                        }}
                    />
                    <Post
                        content={'Poopity Scoop'}
                        likes={31}
                        datePosted={'15:00'}
                        user={{
                            fullName: 'Kanye West',
                            id: 69,
                            pictureUrl: '/users/kwest.jpg'
                        }}
                    />
                </Segment.Group>
            </Container>
        </div>
        );
    }
}

export default withCookies(Blog);
