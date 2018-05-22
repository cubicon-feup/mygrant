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
            blogOwner: {},
            displayLoadMore: true,
            page: 0,
            postCount: 0,
            posts: []
        };

        this.loadUserInfo();
        this.loadPosts();
    }

    loadUserInfo() {
        const { cookies } = this.props;
        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };

        fetch(`/api/users/${this.props.match.params.id}`, { headers })
            .then(res => res.json()
                .then(data => {
                    this.setState({ blogOwner: data });
                })
            );

        fetch(`/api/users/${this.props.match.params.id}/postcount`, { headers })
            .then(res => res.json()
                .then(data => {
                    this.setState({ postCount: data.n_posts });
                })
            );
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
                                        liked={ Boolean(parseInt(post.liked, 10)) }
                                        postInfo={{
                                            commentCount: post.n_replies,
                                            content: post.message,
                                            datePosted: post.date_posted,
                                            id: post.id,
                                            likes: post.n_likes
                                        }}
                                        user={{
                                            fullName: post.full_name,
                                            id: post.sender_id,
                                            pictureUrl: post.image_url ? post.image_url : '/users/kwest.jpg'
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

    submitNewPost(content) {
        const { cookies } = this.props;
        const headers = {
            Authorization: `Bearer ${cookies.get('id_token')}`,
            'content-type': 'application/json'
        };

        const data = { content };

        fetch(`/api/users/${this.props.match.params.id}/posts`, {
            body: JSON.stringify(data),
            headers,
            method: 'POST'
        })
            .then(res => {
                // Everything went well
                if (res.status === 201) {
                    // refresh page
                    window.location.reload();
                }
            });
    }

    render() {
        const { cookies } = this.props;
        const canPost = cookies.get('user_id') === this.props.match.params.id;

        return (
            <div>
                <Container className="main-container blog" >
                    <BlogHeader user={{
                        city: this.state.blogOwner.city,
                        country: this.state.blogOwner.country,
                        fullName: this.state.blogOwner.full_name,
                        id: this.state.blogOwner.user_id,
                        pictureUrl: this.state.blogOwner.picture_url ? this.state.blogOwner.pictureUrl : 'users/kwest.jpg',
                        postCount: this.state.postCount
                    }} />
                {
                    canPost
                        ? <Responsive as={NewPost} minWidth={768} handleClick={this.submitNewPost.bind(this)}/>
                        : null
                }
                {
                    canPost
                        ? <Responsive as={Container} maxWidth={768} textAlign={'center'}>
                            <Button textAlign={'center'} className={'write-new-comment'} >
                                {'New Post'}
                            </Button>
                        </Responsive>
                        : null
                }
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
