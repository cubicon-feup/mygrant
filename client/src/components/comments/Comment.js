import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';

// import Comment from './Comment';

const apiPath = require('../../config').apiPath;
const urlGetNestedComments = commentId => apiPath + `/comments/` + commentId + `/nested_comments`;
const urlEditComment = commentId => apiPath + `/comments/` + commentId;

class Comment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nestedComments: [],
            commentMessage: this.props.comment.message,
            editComment: this.props.comment.message
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

    handleChange(event) {
        this.setState({editComment: event.target.value});
    }

    handleEdit() {
        fetch(urlEditComment(this.props.comment.comment_id), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: this.state.editComment
            })
        }).then(res => {
            if(res.status === 200)
                this.setState({commentMessage: this.state.editComment});
        })
    }

    onRemove(commentId) {
        this.props.onRemove(commentId);
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
                <textarea value={this.state.editComment} onChange={this.handleChange.bind(this)} />
                <Button>Reply</Button>
                <Button onClick={this.handleEdit.bind(this)}>Edit</Button>
                <Button onClick={this.onRemove.bind(this, this.props.comment.comment_id)}>Remove</Button>
                {nestedComments}
            </Container>
        )
    }
}

export default Comment;
