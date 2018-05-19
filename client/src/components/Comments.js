import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/Comments.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { Button, Comment, Container, Form, Header } from 'semantic-ui-react';

const urlToUser = id => `/user/${id}`;
const urlForComments = '/api/comments';
const urlGetTopComments = (type, id) =>
    `/api/comments/top_comments?${type}=${id}`;
const urlGetNestedComments = id => `/api/comments/${id}/nested_comments`;

class CommentD extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.comment;
    }

    componentDidMount() {
        this.setState({ showComments: false });
        this.fetchNestedComments();
    }

    fetchNestedComments() {
        fetch(urlGetNestedComments(this.state.comment_id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({
                        nestedComments: result,
                        showComments: true
                    });
                },
                () => {
                    console.log('ERROR', 'Failed to fetch nested comments.');
                }
            );
    }

    render() {
        return (
            <Comment key={`${this.state.comment_id}`}>
                <Comment.Avatar
                    as={Link}
                    to={urlToUser(this.state.sender_id)}
                    src={this.state.image_url}
                />
                <Comment.Content>
                    <Comment.Author
                        as={Link}
                        to={urlToUser(this.state.sender_id)}
                        content={this.state.sender_name}
                    />
                    <Comment.Metadata>
                        <span>{this.state.date_posted}</span>
                    </Comment.Metadata>
                    <Comment.Text>{this.state.message}</Comment.Text>
                </Comment.Content>
                <Comment.Actions>
                    <Comment.Action
                        active={
                            this.props.in_reply_to === this.state.comment_id
                        }
                        id="whitetext"
                        content={'Reply'}
                        onClick={this.props.handleReplyClick(
                            this.state.comment_id
                        )}
                    />
                </Comment.Actions>
                <Comment.Group>
                    {this.state.showComments
                        ? this.state.nestedComments.map(comment =>
                              <CommentD
                                  comment={comment}
                                  handleReplyClick={() =>
                                      this.props.handleReplyClick
                                  }
                                  handleChange={() => this.props.handleChange}
                                  handleSubmit={() => this.props.handleSubmit}
                              />
                          )
                        : null}
                </Comment.Group>
                {this.props.in_reply_to === this.state.comment_id &&
                    <Form reply onSubmit={this.handleSubmit}>
                        <Form.TextArea
                            required
                            name="message"
                            onChange={this.handleChange}
                        />
                        <Form.Button
                            content={`Reply to ${this.state.sender_name}`}
                            labelPosition="left"
                            icon="edit"
                        />
                    </Form>
                }
            </Comment>
        );
    }
}

class CommentsSection extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            id: this.props.id,
            comments: [{}],
            showComments: false,
            in_reply_to: ''
        };
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    fetchTopComments() {
        var type =
            this.props.type === 'services' ? 'service_id' : 'crowdfudning_id';
        fetch(urlGetTopComments(type, this.state.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({ comments: result });
                },
                () => {
                    console.log('ERROR', 'Failed to fetch top comments.');
                }
            );
    }

    handleReplyClick = comment_id => e => {
        this.setState({ in_reply_to: comment_id });
    };

    handleSubmit = e => {
        const { cookies } = this.props;
        e.preventDefault();

        var type =
            this.state.type === 'services' ? 'service_id' : 'crowdfunding_id';

        fetch(urlForComments, {
            method: 'PUT',
            body: JSON.stringify({
                [type]: this.props.id,
                message: this.state.message,
                in_reply_to: this.state.in_reply_to
            }),
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
                'Content-Type': 'application/json'
            }
        }).then(
            () => {
                this.setState({
                    message: '',
                    in_reply_to: ''
                });
                this.fetchTopComments();
            },
            () => {
                console.log('ERROR', 'Failed to submit comment');
            }
        );
    };

    renderComments() {
        return (
            <Comment.Group id="commentssection">
                <Header as="h4" id="whitetext">
                    Comments
                </Header>
                {this.state.comments.map(comment =>
                    <CommentD
                        comment={comment}
                        handleReplyClick={() => this.handleReplyClick}
                        handleChange={() => this.handleChange}
                        handleSubmit={() => this.handleSubmit}
                    />
                )}

                <Form onSubmit={this.handleSubmit}>
                    <Form.TextArea
                        required
                        name="message"
                        onChange={this.handleChange}
                        onClick={this.handleReplyClick(null)}
                    />
                    <Form.Button
                        content="Add Comment"
                        labelPosition="left"
                        icon="edit"
                    />
                </Form>
            </Comment.Group>
        );
    }

    render() {
        return (
            <Container fluid className="purple-background">
                <Container>
                    {this.state.showComments
                        ? this.renderComments()
                     : <Button
                            className="mygrant-button3"
                            content="Show Comments"
                            onClick={() => {
                                this.fetchTopComments();
                                this.setState({ showComments: true });
                            }}
                        />
                    }
                </Container>
            </Container>
        );
    }
}

export default withCookies(CommentsSection);
