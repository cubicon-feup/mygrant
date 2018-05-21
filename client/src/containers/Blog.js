import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { Button, Container, Segment, Responsive } from 'semantic-ui-react';
import BlogPost from '../components/BlogPost';
import NewPost from '../components/NewPost';
import BlogHeader from '../components/BlogHeader';
import '../css/Blog.css';

class Blog extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        match: ReactRouterPropTypes.match.isRequired
     };

    constructor(props) {
        super(props);

        this.state = {
            displayLoadMore: true,
            page: 0,
            posts: []
        };

        this.loadPosts();
    }

    loadPosts() {

        const { cookies } = this.props;
        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };

        fetch(`/api/users/${this.props.match.params.id}/posts?page=${this.state.page}`, { headers })
            .then(res => {
                res.json()
                    .then(data => {
                        if (res.status === 200) {
                            const postElements = [];

                            data.posts.forEach(post => {
                                postElements.push(
                                    <BlogPost
                                        linked
                                        postInfo={{
                                            commentCount: post.n_replies,
                                            content: post.message,
                                            datePosted: post.date_posted,
                                            id: post.id,
                                            likes: post.n_likes
                                        }}
                                        user={{
                                            fullName: 'Kanye West',
                                            id: 69,
                                            pictureUrl: '/users/kwest.jpg'
                                        }}
                                    />
                                );
                            });

                            this.setState({
                                displayLoadMore: Boolean(data.posts.length >= 20),
                                page: this.state.page + 1,
                                posts: this.state.posts.concat(postElements)
                            });
                        }
                    });

            });
    }

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
                <Responsive as={NewPost} minWidth={768} />
                <Responsive as={Container} maxWidth={768} textAlign={'center'}>
                    <Button textAlign={'center'} className={'write-new-comment'} >
                        {'New Post'}
                    </Button>
                </Responsive>
                <Segment.Group>
                    {this.state.posts}
                    {
                        this.state.displayLoadMore
                            ? <Responsive as={Segment} minWidth={768} textAlign={'center'} className={'load-more-comments'} onClick={this.loadPosts.bind(this)}>
                                {'Load more posts'}
                            </Responsive>
                            : null
                    }
                </Segment.Group>
                {
                    this.state.displayLoadMore
                        ? <Responsive as={Container} maxWidth={768} textAlign={'center'}>
                            <Button textAlign={'center'} className={'load-more-comments'} onClick={this.loadPosts.bind(this)}>
                                {'Load more posts'}
                            </Button>
                        </Responsive>
                        : null
                }
            </Container>
        </div>
        );
    }
}

export default withCookies(Blog);
