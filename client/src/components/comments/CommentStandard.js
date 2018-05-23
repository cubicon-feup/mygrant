import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Comment } from 'semantic-ui-react';

// import CommentStandard from './CommentStandard';

const apiPath = require('../../config').apiPath;
const urlGetNestedComments = commentId => apiPath + `/comments/` + commentId + `/nested_comments`;
const urleditMessage = commentId => apiPath + `/comments/` + commentId;

class CommentStandard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nestedComments: [],
            commentMessage: this.props.comment.message,
            editMessage: this.props.comment.message,
            replyMessage: ''
        }
    }

    componentDidMount() {
        this.getNestedComments();
    }

    getNestedComments() {
        fetch(urlGetNestedComments(this.props.comment.comment_id), {
            method: 'GET'
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({nestedComments: data});
                    })
            }
        })
    }

    handleEditChange(event) {
        this.setState({editMessage: event.target.value});
    }

    handleReplyChange(event) {
        this.setState({replyMessage: event.target.value});
    }

    handleEdit() {
        fetch(urleditMessage(this.props.comment.comment_id), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: this.state.editMessage
            })
        }).then(res => {
            if(res.status === 200)
                this.setState({commentMessage: this.state.editMessage});
        })
    }

    onRemove(commentId) {
        this.props.onRemove(commentId);
    }

    onReply(inReplyTo, message) {
        this.props.onReply(inReplyTo, this.state.replyMessage);
    }

    render() {
        let nestedComments;
        if(this.state.nestedComments) {
            nestedComments = this.state.nestedComments.map(nestedComment => {
                return (
                    <CommentStandard key={nestedComment.comment_id} comment={nestedComment}/>
                )
            })
        } else nestedComments = null;
        /*<Container>
                <a href="#">{this.props.comment.user_name}</a>
                {this.state.commentMessage}
                {this.props.comment.date_posted}
                <textarea value={this.state.replyMessage} onChange={this.handleReplyChange.bind(this)} />
            <Button onClick={this.onReply.bind(this, this.props.comment.comment_id, this.state.replyMessage)}>Reply</Button>
            <textarea value={this.state.editMessage} onChange={this.handleEditChange.bind(this)} />
            <Button onClick={this.handleEdit.bind(this)}>Edit</Button>
            <Button onClick={this.onRemove.bind(this, this.props.comment.comment_id)}>Remove</Button>
            {nestedComments}
        </Container>*/
        return (
            <Comment>
                <Comment.Avatar src='/img/user.jpg' />
                <Comment.Content>
                    <Comment.Author as={Link} to={"/crowdfunding/2"}>{this.props.comment.user_name}</Comment.Author>
                    <Comment.Metadata><span>{new Date(this.props.comment.date_posted).toLocaleString()}</span></Comment.Metadata>
                    <Comment.Text>{this.state.commentMessage}</Comment.Text>
                    <Comment.Actions>
                        <Comment.Action onClick={this.onReply.bind(this, this.props.comment.comment_id, this.state.replyMessage)}>Reply</Comment.Action>
                        <Comment.Action onClick={this.handleEdit.bind(this)}>Edit</Comment.Action>
                        <Comment.Action onClick={this.onRemove.bind(this, this.props.comment.comment_id)}>Remove</Comment.Action>
                    </Comment.Actions>
                </Comment.Content>
                <Comment.Group>
                    {nestedComments}
                </Comment.Group>
            </Comment>
        )
    }
}

export default CommentStandard;
