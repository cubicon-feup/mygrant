import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import MessageBubble from '../components/MessageBubble';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Button, Container, Form, Grid, TextArea } from 'semantic-ui-react';

import '../css/Conversation.css';

class Conversation extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        match: ReactRouterPropTypes.match.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            messageList: []
        };
        this.otherUserId = this.props.match.params.id;

        this.textArea = null;
        this.otherUser = null;

        this.setTextArea = component => {
            this.textArea = component;
        };

        const { cookies } = this.props;
        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };

        // Get the other user's info
        fetch(`/api/users/${this.otherUserId}`, { headers })
            .then(res => res.json()
                .then(data => {
                    this.otherUser = data;

                    // Get the messages sent between this user and the other one
                    fetch(`/api/messages/${this.otherUser.user_id}`, { headers })
                        .then(msgRes => msgRes.json()
                            .then(fetchedMessages => {
                                const messageList = [];

                                // Insert the messages
                                for (let index = 0; index < fetchedMessages.length; index += 1) {
                                    const msg = fetchedMessages[index];
                                    const msgIsFirst =
                                        index === 0 ||
                                            (msg.sender_id !== this.otherUser.user_id && fetchedMessages[index - 1].sender_id === this.otherUser.user_id) ||
                                            (msg.sender_id === this.otherUser.user_id && fetchedMessages[index - 1].sender_id !== this.otherUser.user_id);

                                    const msgIsLast =
                                        index === fetchedMessages.length - 1 ||
                                            (msg.sender_id !== this.otherUser.user_id && fetchedMessages[index + 1].sender_id === this.otherUser.user_id) ||
                                            (msg.sender_id === this.otherUser.user_id && fetchedMessages[index + 1].sender_id !== this.otherUser.user_id);

                                    messageList.push(
                                        <Grid.Row 
                                            streched
                                            className={
                                                `${msg.sender_id === this.otherUser.id ? 'incoming' : 'outgoing'}
                                                 ${msgIsLast ? 'stop' : ''}
                                                 ${msgIsFirst ? 'start' : ''}
                                                 ${!msgIsLast && !msgIsFirst ? 'middle' : ''}
                                                `
                                            }
                                        >
                                            <Grid.Column>
                                                <MessageBubble
                                                    incoming={msg.sender_id === this.otherUser.user_id}
                                                    message={{
                                                        content: msg.content,
                                                        date: msg.date_sent,
                                                        user: {
                                                            name: 'Kanye West',
                                                            picture: null
                                                        }
                                                    }}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    );
                                }
                                this.setState({ messageList });
                            })
                        );
                })
            );
    }

    updateMessage(event, data) {
        this.setState({ message: data.value });
    }

    sendMessage() {
        const { cookies } = this.props;

        if (!cookies) {
            return;
        }

        const headers = {
            Authorization: `Bearer ${cookies.get('id_token')}`,
            'content-type': 'application/json'
        };

        const data = {
            content: this.state.message,
            'receiver_id': this.otherUser.user_id
        }

        // Send message
        fetch(
            '/api/messages/', {
                body: JSON.stringify(data),
                headers,
                method: 'POST'
            })
            .then(res => console.log(res));
    }

    render() {
        return (
            <div>
                <Container className="main-container conversation" >
                    <Grid >
                        {this.state.messageList}
                    </Grid>
                    <Form onSubmit={this.sendMessage.bind(this)} >
                        <label>{'send a new message'.toUpperCase()}</label>
                        <TextArea onChange={this.updateMessage.bind(this)} ref={this.setTextArea} />
                        <Button circular size={'small'} content={'send'.toUpperCase()}></Button>
                    </Form>
                </Container>
            </div>
        )
    }

}

export default withCookies(Conversation);
