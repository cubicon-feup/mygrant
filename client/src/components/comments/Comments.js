import React, { Component } from 'react';
import { Container, Button, Form, Responsive } from 'semantic-ui-react';

import Comment from './Comment';
import { MygrantDividerLeft } from '../Common';

const apiPath = require('../../config').apiPath;
const urlGetTopComments = (originField, originId) => apiPath + `/comments/top_comments?` + originField + `=` + originId;
const urlCreateComment = apiPath + `/comments`;
const urlRemoveComment = commentId => apiPath + `/comments/` + commentId;

class Comments extends Component {

    // originField: crowdfundings or services.
    // originId: crowdfunding or service ID.

    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            postingComment: '',
        }
    }

    componentDidMount() {
        this.getComments();
    }

    getComments() {
        fetch(urlGetTopComments(this.props.originField, this.props.originId), {
            method: 'GET'
        }).then(res => {
            if(res.status === 200) {
                res.json()
                  .then(data => {
                      this.setState({comments: data});
                  })
            }
        })
    }

    handleChange(event) {
        this.setState({postingComment: event.target.value});
    }

    handleSubmit(event) {
        this.handleCreateComment(null, this.state.postingComment)
        event.preventDefault();
    }

    handleRemove(commentId) {
        fetch(urlRemoveComment(commentId), {
            method: 'DELETE'
        }).then(res => {
            if(res.status === 200) {
                let comments = this.state.comments;
                for(let i = 0; i < comments.length; i++) {
                    if(comments[i].comment_id === commentId) {
                        comments.splice(i, 1);
                        break;
                    }
                }
                this.setState({comments: comments});
            }
        })
    }

    handleCreateComment(inReplyTo, message) {
        if(this.props.originField == 'crowdfunding_id') {
            fetch(urlCreateComment, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    crowdfunding_id: this.props.originId,
                    in_reply_to: inReplyTo
                })
            }).then(res => {
                if(res.status === 201) {
                    res.json()
                        .then(data => {
                            let newComment = {
                                message: message,
                                date_posted: data.date_posted,
                                comment_id: data.id
                            }
                            let updatedComments = this.state.comments;
                            updatedComments.push(newComment);
                            this.setState({comments: updatedComments});
                            this.setState(this.setState({postingComment: ''}));
                            this.forceUpdate();
                        })
                }
            })
        } else {
            fetch(urlCreateComment, {
                method: 'PUT',
                body: JSON.stringify({
                    message: message,
                    service_id: this.props.originId,
                    in_reply_to: inReplyTo
                })
            }).then(res => {
                if(res === 201) {
                    res.json()
                        .then(data => {
                            let newComment = {
                                message: message,
                                date_posted: data.date_posted,
                                comment_id: data.id
                            }
                            let updatedComments = this.state.comments;
                            updatedComments.push(newComment);
                            this.setState({comments: updatedComments});
                            this.setState(this.setState({postingComment: ''}));
                            this.forceUpdate();
                        })
                }
            })
        }
    }

    render() {
        let comments;
        if(this.state.comments) {
            comments = this.state.comments.map(comment => {
                return (
                    <Comment key={comment.comment_id} comment={comment} onRemove={this.handleRemove.bind(this)} onReply={this.handleCreateComment.bind(this)}/>
                )
            })
        } else {
            comments =
                <Container>
                    <p>No comments yet</p>
                </Container>
        }
        return (
            <div>
            <Container>
                <h3>Comments</h3>
            </Container>
            <Responsive as={MygrantDividerLeft} minWidth={768} className="intro-divider" color="purple" />
            <Container id="crowdfunding_comments">
                {comments}
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <Form.TextArea value={this.state.postingComment} onChange={this.handleChange.bind(this)} />
                    <Form.Button content='Comment' labelPosition='left' icon='edit' primary />
                </Form>
            </Container>
            </div>
        )
    }
}

export default Comments;
