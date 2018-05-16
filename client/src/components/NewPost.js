import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Button, Container, Form, Grid, Header, Icon, Image, Segment, TextArea } from 'semantic-ui-react';

class NewPost extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = { content: '' };
    }

    updateContent(event, data) {
        this.setState({ content: data.value });
    }

    render() {
        return (
            <Segment className={'new-post'}>
                <Form>
                    <TextArea onChange={this.updateContent.bind(this)} placeholder={'Write something'}/>
                </Form>
                <Button circular size={'small'} content={'send'.toUpperCase()}></Button>
            </Segment>
        );
    }
}

export default NewPost;
