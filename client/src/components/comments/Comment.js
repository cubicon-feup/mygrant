import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';

// import Comment from './Comment';

const apiPath = require('../../config').apiPath;
const urlGetNestedComments = commentId => apiPath + `/comments/` + commentId + `/nested_comments`;
const urleditMessage = commentId => apiPath + `/comments/` + commentId;

class Comment extends Component {

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
                    <Comment key={nestedComment.comment_id} comment={nestedComment}/>
                )
            })
        } else nestedComments = null;
        return (
            <Container>
                <a href="#">{this.props.comment.user_name}</a>
                {this.state.commentMessage}
                {this.props.comment.date_posted}
                <textarea value={this.state.replyMessage} onChange={this.handleReplyChange.bind(this)} /> {/* Should be hidden, only when the user presses the reply button this shows.*/}
                <Button onClick={this.onReply.bind(this, this.props.comment.comment_id, this.state.replyMessage)}>Reply</Button>
                <textarea value={this.state.editMessage} onChange={this.handleEditChange.bind(this)} /> {/* Should be hidden, only when the user presses the edit button this shows.*/}
                <Button onClick={this.handleEdit.bind(this)}>Edit</Button>
                <Button onClick={this.onRemove.bind(this, this.props.comment.comment_id)}>Remove</Button>
                {nestedComments}
            </Container>
        )
    }
}

export default Comment;
