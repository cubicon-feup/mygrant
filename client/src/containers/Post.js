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
            comments: [],
            displayLoadMore: true,
            page: 0,
            post: {}
        };

        this.getPostInfo();
        this.loadComments();
    }

    getPostInfo() {
        const { cookies } = this.props;
        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };

        fetch(`/api/posts/${this.props.match.params.id}`, { headers })
            .then(res => res.json()
                .then(data => {
                    this.setState({ post: data.post });
                })
            );
    }

    loadComments() {
        const { cookies } = this.props;
        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };

        fetch(`/api/posts/${this.props.match.params.id}/comments?page=${this.state.page}`, { headers })
            .then(res => res.json()
                .then(comments => {
                    let commentElements = [];
                    console.log(comments)
                    comments.forEach(comment => {
                        commentElements = [
                            <BlogComment
                                postInfo={{
                                    content: comment.message,
                                    datePosted: comment.date_posted,
                                    id: comment.id,
                                    likes: comment.n_likes
                                }}

                                user={{
                                    fullName: comment.full_name,
                                    id: comment.sender_id,
                                    pictureUrl: comment.image_url ? comment.image_url : '/users/kwest.jpg'
                                }}
                            />
                        ].concat(commentElements);
                    });

                    commentElements = commentElements.concat(this.state.comments);
                    this.setState({
                        comments: commentElements,
                        displayLoadMore: Boolean(comments.length >= 20),
                        page: this.state.page + 1
                    });
                })
            );

    }

    render() {
        return (
            <Container className={'main-container post'} >
                <Segment>
                    <BlogHeaderPost
                        postInfo={{
                            commentCount: this.state.post.n_replies,
                            content: this.state.post.message,
                            datePosted: this.state.post.date_sent,
                        id: this.state.post.id,
                        likes: this.state.post.n_likes
                        }}
                        user={{
                            fullName: this.state.post.full_name,
                            id: this.state.post.sender_id,
                            pictureUrl: this.state.post.image_url ? this.state.post.image_url : '/users/kwest.jpg'
                        }}
                    />
                </Segment>
                <Responsive as={NewPost} minWidth={768} />
                <Responsive as={Container} maxWidth={768} textAlign={'center'}>
                    {
                        this.state.displayLoadMore
                        ? <Button textAlign={'center'} className={'load-more-comments'} onClick={this.loadComments.bind(this)} >
                                {'Load more comments'}
                            </Button>
                        : null
                    }
                </Responsive>
                <Segment.Group>
                    {
                        this.state.displayLoadMore
                            ? <Responsive as={Segment} minWidth={768} textAlign={'center'}
                                className={'load-more-comments'} onClick={this.loadComments.bind(this)}
                            >
                                {'Load more comments'}
                            </Responsive>
                            : null
                    }
                    {this.state.comments}
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
