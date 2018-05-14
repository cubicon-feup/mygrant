import React, { Component } from 'react';
import { Container, Button, Form } from 'semantic-ui-react';

import Comment from './Comment';

const apiPath = require('../../config').apiPath;
const urlGetTopComments = (originField, originId) => apiPath + `/comments/top_comments?` + originField + `=` + originId;
const urlCreateComment = id => apiPath + `/comments`;

class Comments extends Component {

    // originField: crowdfundings or services.
    // originId: crowdfunding or service ID.

    constructor(props) {
        super(props);
        this.state = {
            comments: []
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

    onReply(repliedCommentId) {

    }

    render() {
        let comments;
        if(this.state.comments) {
            comments = this.state.comments.map(comment => {
                return (
                    <Comment key={comment.comment_id} comment={comment}/>
                )
            })
        } else {
            comments = 
                <Container>
                    <p>No comments yet</p>
                </Container>
        }
        return (
            <Container>
                <h3>Comments</h3>
                {comments}
                <Form reply>
                    <Form.TextArea />
                    <Button content='Comment' labelPosition='left' icon='edit' primary />
                </Form>
            </Container>
        )
    }
}

export default Comments;
