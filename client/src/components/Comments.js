import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/Comments.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { Button, Comment, Container, Form, Header } from 'semantic-ui-react';

const urlToUser = id => `/user/${id}`;
const urlForComments = '/api/comments';
const urlForCommentActions = id => `/api/comments/${id}`;
const urlGetTopComments = (type, id) =>
    `/api/comments/top_comments?${type}=${id}`;
const urlGetNestedComments = id => `/api/comments/${id}/nested_comments`;

class CommentD extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.comment;

        this.fetchNestedComments = this.fetchNestedComments.bind(this);
    }

    componentDidMount() {
        this.setState({
            showNestedComments: false,
            showReplyBox: false,
            showEditBox: false
        });
        this.fetchNestedComments();
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleSubmit = () => {
        this.props.handleSubmit(
            this.state.replyMessage,
            this.state.comment_id,
            this.fetchNestedComments
        );
    };

    handleEdit = () => {
        this.props.handleEdit(this.state.replyMessage, this.state.comment_id);
        this.setState({ message: this.state.replyMessage });
    };

    handleDelete = () => {
        this.props.handleDelete(this.state.comment_id);
        this.setState({ message: 'Comment removed' });
    };

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
                    result.length > 0
                        ? this.setState({
                              nestedComments: result,
                              showNestedComments: true
                          })
                        : this.setState({
                              nestedComments: result,
                              showNestedComments: false
                          });
                },
                () => {
                    console.log('ERROR', 'Failed to fetch nested comments.');
                }
            );
    }

    renderForm() {
        if (this.state.showReplyBox) {
            return (
                <Form reply onSubmit={this.handleSubmit}>
                    <Form.TextArea
                        required
                        autoFocus
                        name="replyMessage"
                        value={this.state.replyMessage}
                        onChange={this.handleChange}
                    />
                    <Form.Button
                        content={`Reply to ${this.state.user_name}`}
                        labelPosition="left"
                        icon="edit"
                    />
                </Form>
            );
        } else if (this.state.showEditBox) {
            return (
                <Form reply onSubmit={this.handleEdit}>
                    <Form.TextArea
                        required
                        autoFocus
                        name="replyMessage"
                        value={this.state.replyMessage}
                        onChange={this.handleChange}
                    />
                    <Form.Button
                        content={'Save edditted comment'}
                        labelPosition="left"
                        icon="edit"
                    />
                </Form>
            );
        }
    }

    renderOwnerActions() {
        return (
            <Comment.Actions>
                <Comment.Action
                    key={`${this.state.comment_id}-reply`}
                    id="whitetext"
                    content={'Reply'}
                    onClick={() =>
                        this.setState({
                            showReplyBox: true,
                            showEditBox: false
                        })
                    }
                />
                {this.props.currentUser === this.state.user_id
                    ? [
                        <Comment.Action
                            key={`${this.state.comment_id}-edit`}
                            id="whitetext"
                            content={'Edit'}
                            onClick={() =>
                                this.setState({
                                    showReplyBox: false,
                                    showEditBox: true
                                })
                            }
                        />,
                        <Comment.Action
                            key={`${this.state.comment_id}-delete`}
                            id="whitetext"
                            content={'Delete'}
                            onClick={this.handleDelete}
                        />
                    ]
                 : <Comment.Action
                        key={`${this.state.comment_id}-report`}
                        id="whitetext"
                        content={'Report'}
                    />
                }
            </Comment.Actions>
        );
    }

    render() {
        return (
            <Comment key={`${this.state.comment_id}`}>
                <Comment.Avatar
                    as={Link}
                    to={urlToUser(this.state.user_id)}
                    src={this.state.image_url}
                />
                <Comment.Content>
                    <Comment.Author
                        as={Link}
                        to={urlToUser(this.state.user_id)}
                        content={this.state.user_name}
                    />
                    <Comment.Metadata>
                        <span>{this.state.date_posted}</span>
                    </Comment.Metadata>
                    <Comment.Text>{this.state.message}</Comment.Text>
                    {this.renderOwnerActions()}
                </Comment.Content>

                {this.state.showNestedComments
                    ? <Comment.Group id="full-max-width">
                        {this.state.nestedComments.map(comment =>
                            <CommentD
                                key={comment.comment_id}
                                currentUser={this.props.currentUser}
                                comment={comment}
                                handleSubmit={this.props.handleSubmit}
                                handleEdit={this.props.handleEdit}
                                handleDelete={this.props.handleDelete}
                            />
                        )}
                    </Comment.Group>
                 : null}
                {this.renderForm()}
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
            comments: [],
            showComments: false
        };
    }

    componentDidMount() {
        const { cookies } = this.props;
        this.setState({ currentUser: parseInt(cookies.get('user_id'), 10) });
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    fetchTopComments() {
        var type =
            this.props.type === 'services' ? 'service_id' : 'crowdfunding_id';
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
                    this.setState({
                        comments: result,
                        showComments: true
                    });
                },
                () => {
                    console.log('ERROR', 'Failed to fetch top comments.');
                }
            );
    }

    handleSubmit = (replyMessage, replyTo, parent) => {
        const { cookies } = this.props;

        var type =
            this.state.type === 'services' ? 'service_id' : 'crowdfunding_id';
        fetch(urlForComments, {
            method: 'PUT',
            body: JSON.stringify({
                [type]: this.props.id,
                message: replyMessage,
                in_reply_to: replyTo
            }),
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
                'Content-Type': 'application/json'
            }
        }).then(
            () => {
                parent && this.fetchTopComments();
            },
            () => {
                console.log('ERROR', 'Failed to submit comment');
            }
        );
    };

    handleParentSubmit = e => {
        e.preventDefault();
        this.handleSubmit(this.state.replyMessage, null, true);
    };

    handleChildSubmit = (replyMessage, replyTo, fetchNestedComments) => {
        this.handleSubmit(replyMessage, replyTo);
        fetchNestedComments();
    };

    handleEdit = (newMessage, commentID) => {
        const { cookies } = this.props;

        fetch(urlForCommentActions(commentID), {
            method: 'PUT',
            body: JSON.stringify({ message: newMessage }),
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
                'Content-Type': 'application/json'
            }
        }).then({}, () => {
            console.log('ERROR', 'Failed to edit comment');
        });
    };

    handleDelete = (commentID, parent) => {
        const { cookies } = this.props;

        fetch(urlForCommentActions(commentID), {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
                'Content-Type': 'application/json'
            }
        }).then(
            () => {
                parent && this.fetchTopComments();
            },
            () => {
                console.log('ERROR', 'Failed to delete comment');
            }
        );
    };

    renderComments() {
        return (
            <Comment.Group minimal id="commentssection">
                <Header as="h4" id="whitetext">
                    Comments
                </Header>
                {this.state.comments.map(comment =>
                    <CommentD
                        key={comment.comment_id}
                        currentUser={this.state.currentUser}
                        comment={comment}
                        handleSubmit={this.handleChildSubmit.bind(this)}
                        handleEdit={this.handleEdit.bind(this)}
                        handleDelete={this.handleDelete.bind(this)}
                    />
                )}

                <Form onSubmit={this.handleParentSubmit}>
                    <Form.TextArea
                        required
                        name="replyMessage"
                        onChange={this.handleChange}
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
                            onClick={() => this.fetchTopComments()}
                        />
                    }
                </Container>
            </Container>
        );
    }
}

export default withCookies(CommentsSection);
