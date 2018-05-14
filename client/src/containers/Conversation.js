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
                            .then(messages => {
                                this.setState({ messageList: messages });
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
            'receiver_id': this.otherUser,
            'sender_id': cookies.get('id_token')
        }

        // Send message
        console.log(this.state);
    }

    render() {
        return (
            <div>
                <Container className="main-container conversation" >
                    <Grid >
                        <Grid.Row streched className="incoming" >
                            <Grid.Column streched >
                                <MessageBubble incoming
                                    message={{
                                        content: 'Hi',
                                        date: '15:00',
                                        user: {
                                            name: 'Kanye West',
                                            picture: null
                                        }
                                    }}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="outgoing" >
                            <Grid.Column streched >
                                <MessageBubble outgoing
                                    message={{
                                        content: 'Hi',
                                        date: '15:10',
                                        user: {
                                            name: 'Edgar Passos',
                                            picture: null
                                        }
                                    }}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="outgoing stop" >
                            <Grid.Column streched >
                                <MessageBubble outgoing
                                    message={{
                                        content: 'Sup',
                                        date: '15:10',
                                        user: {
                                            name: 'Edgar Passos',
                                            picture: null
                                        }
                                    }}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="incoming" >
                            <Grid.Column streched >
                                <MessageBubble incoming
                                    message={{
                                        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
                                        date: '15:10',
                                        user: {
                                            name: 'Edgar Passos',
                                            picture: null
                                        }
                                    }}
                                />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row className="outgoing stop" >
                            <Grid.Column streched >
                                <MessageBubble outgoing
                                    message={{
                                        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
                                        date: '15:10',
                                        user: {
                                            name: 'Edgar Passos',
                                            picture: null
                                        }
                                    }}
                                />
                            </Grid.Column>
                        </Grid.Row>
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
