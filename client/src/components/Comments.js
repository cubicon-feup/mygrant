import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/Comments.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { Button, Comment, Container, Form, Header } from 'semantic-ui-react';

const urlForComments = (type, id) => `/api/${type}/${id}/comments`;
const urlToUser = id => `/user/${id}`;

class CommentsSection extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type,
            id: this.props.id,
            comments: [{}],
            showComments: false
        };
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    fetchComments() {
        fetch(urlForComments(this.state.type, this.state.id))
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
                    console.log('ERROR', 'Failed to fetch comments.');
                }
            );
    }

    // TODO: in_reply_to
    handleSubmit = e => {
        const { cookies } = this.props;
        e.preventDefault();

        fetch(urlForComments(this.state.type, this.state.id), {
            method: 'POST',
            body: JSON.stringify({
                message: this.state.message,
                in_reply_to: null
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
                this.fetchComments();
            },
            () => {
                console.log('ERROR', 'Failed to submit comment');
            }
        );
    };

    renderComments() {
        return (
            <Comment.Group minimal id="commentssection">
                <Header as="h4" id="whitetext">
                    Comments
                </Header>
                {this.state.comments.map((comment, index) =>
                    <Comment key={index}>
                        <Comment.Avatar
                            as={Link}
                            to={urlToUser(comment.sender_id)}
                            src={comment.sender_image}
                        />
                        <Comment.Content>
                            <Comment.Author
                                as={Link}
                                to={urlToUser(comment.sender_id)}
                                content={comment.sender_name}
                            />
                            <Comment.Metadata>
                                <span>{comment.date_posted}</span>
                            </Comment.Metadata>
                            <Comment.Text>{comment.message}</Comment.Text>
                        </Comment.Content>
                    </Comment>
                )}

                <Form reply onSubmit={this.handleSubmit}>
                    <Form.TextArea
                        required
                        name="message"
                        value={this.state.message}
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
                            onClick={() => {
                                this.fetchComments();
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
