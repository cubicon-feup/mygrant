import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';

import Comment from './Comment';

const apiPath = require('../../config').apiPath;
const urlGetNestedComments = commentId => apiPath + `/comments/` + commentId + `/nested_comments`; 

class Comments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nestedComments: []
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

    onReply(repliedCommentId) {

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
                {this.props.comment.message}
                <Button>Reply</Button>
                {nestedComments}
            </Container>
        )
    }
}

export default Comments;
