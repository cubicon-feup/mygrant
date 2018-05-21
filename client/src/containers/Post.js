import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import BlogComment from '../components/BlogComment';
import BlogHeaderPost from '../components/BlogHeaderPost';
import NewPost from '../components/NewPost';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Button, Container, Responsive, Segment } from 'semantic-ui-react';

import '../css/Blog.css';

class Post extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        match: ReactRouterPropTypes.match.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            comments: {},
            displayLoadMore: true,
            post: {}
        }

        this.getPostInfo();
        this.loadComments();
    }

    getPostInfo() {
    }

    loadComments() {
    }

    render() {
        return (
            <Container className={'main-container post'} >
                <Segment>
                    <BlogHeaderPost
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
                </Segment>
                <Responsive as={NewPost} minWidth={768} />
                <Responsive as={Container} maxWidth={768} textAlign={'center'}>
                    <Button textAlign={'center'} className={'load-more-comments'} >
                        {'Load more comments'}
                    </Button>
                </Responsive>
                <Segment.Group>
                    <Responsive as={Segment} minWidth={768} textAlign={'center'} className={'load-more-comments'} >
                        {'Load more comments'}
                    </Responsive>
                    <BlogComment
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
                    <BlogComment
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
                <Responsive as={Container} maxWidth={768} textAlign={'center'}>
                    <Button textAlign={'center'} className={'write-new-comment'} >
                        {'Write a comment'}
                    </Button>
                </Responsive>
            </Container>
        );
    }
}

export default withCookies(Post);
