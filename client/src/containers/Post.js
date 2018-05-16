import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import BlogPost from '../components/BlogPost';
import NewPost from '../components/NewPost';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Button, Container, Form, Grid, Header, Icon, Image, Segment, TextArea } from 'semantic-ui-react';

import '../css/Blog.css';

class Post extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        match: ReactRouterPropTypes.match.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container className={'main-container post'} >
                <BlogPost
                    header
                    postInfo={{
                        commentCount: 2,
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

                    <NewPost/>
                <Segment.Group>
                    <BlogPost
                        comment
                        postInfo={{
                            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
                        datePosted: '15:00',
                        id: 123,
                        likes: 1
                        }}
                        user={{
                            fullName: 'Kanye West',
                            id: 69,
                            pictureUrl: '/users/kwest.jpg'
                        }}
                    />
                    <BlogPost
                        comment
                        postInfo={{
                            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
                        datePosted: '15:00',
                        id: 23,
                        likes: 0
                        }}
                        user={{
                            fullName: 'Kanye West',
                            id: 69,
                            pictureUrl: '/users/kwest.jpg'
                        }}
                    />
                </Segment.Group>
            </Container>
        );
    }
}

export default withCookies(Post);
