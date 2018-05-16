import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { Container, Segment } from 'semantic-ui-react';
import BlogPost from '../components/BlogPost';
import NewPost from '../components/NewPost';
import BlogHeader from '../components/BlogHeader';
import '../css/Blog.css';

class Blog extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    render() {
        return (
            <div>
                <Container className="main-container blog" >
                    <BlogHeader user={{
                        city: 'Chicago',
                        country: 'USA',
                        fullName: 'Kanye West',
                        id: 69,
                        pictureUrl: '/users/kwest.jpg',
                        postCount: 1231
                    }} />
                <NewPost />
                <Segment.Group>
                    <BlogPost
                        postInfo={{
                            commentCount: 12,
                            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
                        datePosted: '15:00',
                        id: 123,
                        likes: 19
                        }}
                        user={{
                            fullName: 'Kanye West',
                            id: 69,
                            pictureUrl: '/users/kwest.jpg'
                        }}
                    />
                    <BlogPost
                        postInfo={{
                            commentCount: 12,
                            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
                        datePosted: '15:00',
                        id: 23,
                        likes: 19
                        }}
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
