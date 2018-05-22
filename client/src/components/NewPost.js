import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { Button, Form, Segment, TextArea } from 'semantic-ui-react';

class NewPost extends Component {
    static propTypes = { handleClick: instanceOf(Function).isRequired };

    constructor(props) {
        super(props);
        this.state = { content: '' };
    }

    updateContent(event, data) {
        this.setState({ content: data.value });
    }

    handleClick() {
        this.props.handleClick(this.state.content);
    }

    render() {
        return (
            <Segment className={'new-post'}>
                <Form>
                    <TextArea onChange={this.updateContent.bind(this)} placeholder={'Write something'}/>
                </Form>
                <Button circular size={'small'} content={'send'.toUpperCase()} onClick={this.props.handleClick.bind(this)} ></Button>
            </Segment>
        );
    }
}

export default NewPost;
