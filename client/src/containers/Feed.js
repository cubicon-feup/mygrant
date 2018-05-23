import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { Button, Container, Segment, Responsive } from 'semantic-ui-react';
import BlogPost from '../components/BlogPost';
import NewPost from '../components/NewPost';
import '../css/Blog.css';

class Feed extends Component {
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

        fetch(`/api/users/${cookies.get('user_id')}/getfeed?page=${this.state.page}`, { headers })
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
                                            pictureUrl: post.image_url
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

        return (
            <div>
                <Container className="main-container blog" >
                <Responsive as={NewPost} minWidth={768} handleClick={this.submitNewPost.bind(this)}/>
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

export default withCookies(Feed);
