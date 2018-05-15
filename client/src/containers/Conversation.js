import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import MessageBubble from '../components/MessageBubble';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Button, Container, Form, Grid, Header, Icon, Image, TextArea } from 'semantic-ui-react';

import '../css/Conversation.css';

class Conversation extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        match: ReactRouterPropTypes.match.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            loadMessages: 'Load more messages',
            message: '',
            messageList: [],
            otherUser: {},
            page: 0
        };

        this.textArea = null;
        this.lastMessage = null;

        this.setTextArea = component => {
            this.textArea = component;
        };

        this.loadMessages();
    }

    loadMessages() {
        const { cookies } = this.props;
        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };

        if (this.state.page < 0) {
            return;
        }

        // Get the other user's info
        fetch(`/api/users/${this.props.match.params.id}`, { headers })
            .then(res => res.json()
                .then(data => {
                    this.setState({ otherUser: data });

                    // Get the messages sent between this user and the other one
                    fetch(`/api/messages/${this.state.otherUser.user_id}?page=${this.state.page}`, { headers })
                        .then(msgRes => msgRes.json()
                            .then(fetchedMessages => {
                                if (fetchedMessages.length < 20) {
                                    this.setState({
                                        loadMessages: '',
                                        page: -2
                                    });
                                }

                                const messageList = [];

                                // Insert the messages
                                for (let index = 0; index < fetchedMessages.length; index += 1) {
                                    const msg = fetchedMessages[index];
                                    const msgIsFirst =
                                        index === 0 ||
                                        (msg.sender_id !== this.state.otherUser.user_id &&
                                            fetchedMessages[index - 1].sender_id === this.state.otherUser.user_id) ||
                                        (msg.sender_id === this.state.otherUser.user_id &&
                                            fetchedMessages[index - 1].sender_id !== this.state.otherUser.user_id);

                                    const msgIsLast =
                                        index === fetchedMessages.length - 1 ||
                                        (msg.sender_id !== this.state.otherUser.user_id &&
                                            fetchedMessages[index + 1].sender_id === this.state.otherUser.user_id) ||
                                        (msg.sender_id === this.state.otherUser.user_id &&
                                            fetchedMessages[index + 1].sender_id !== this.state.otherUser.user_id);

                                    messageList.push(
                                        <Grid.Row
                                            streched
                                            className={
                                                `${msg.sender_id === this.state.otherUser.user_id ? 'incoming' : 'outgoing'}
                                                 ${msgIsLast ? 'stop' : ''}
                                                 ${msgIsFirst ? 'start' : ''}
                                                 ${!msgIsLast && !msgIsFirst ? 'middle' : ''}
                                                `
                                            }
                                        >
                                            <Grid.Column>
                                                <MessageBubble
                                                    incoming={msg.sender_id === this.state.otherUser.user_id}
                                                    message={{
                                                        content: msg.content,
                                                        date: msg.date_sent
                                                    }}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    );
                                }

                                messageList.push(this.state.messageList);
                                this.setState({
                                    messageList,
                                    page: this.state.page + 1
                                });
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
            'receiver_id': this.state.otherUser.user_id
        };

        // Send message
        fetch(
            '/api/messages/', {
                body: JSON.stringify(data),
                headers,
                method: 'POST'
            })
            .then(res => {
                if (res.status === 201) {
                    // refresh page
                    window.location.reload();
                }
            });
    }

    render() {
        return (
            <div>
                <Container className="main-container conversation" >
                    <Grid className="other-user-info" >
                        <Grid.Row>
                            <Grid.Column width={1}>
                                {this.state.otherUser.image_url
                                    ? <Image circular size={'tiny'} src={`/api/images/users/${this.state.otherUser.image_url}`} />
                                    : <Icon name="user circle outline" size={'big'} />
                                }

                            </Grid.Column>
                            <Grid.Column width={14} >
                                <Header as={'h3'}>{this.state.otherUser.full_name}</Header>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid className="message-list">
                        <Grid.Row className="load-more">
                            <Grid.Column
                                textAlign={'center'}
                                onClick={this.loadMessages.bind(this)}
                            >
                                {this.state.loadMessages}
                            </Grid.Column>
                        </Grid.Row>
                        {this.state.messageList}
                    </Grid>
                    <Form onSubmit={this.sendMessage.bind(this)} >
                        <label>{'send a new message'.toUpperCase()}</label>
                        <TextArea onChange={this.updateMessage.bind(this)} ref={this.setTextArea} />
                        <Button circular size={'small'} content={'send'.toUpperCase()}></Button>
                    </Form>
                </Container>
            </div>
        );
    }

}

export default withCookies(Conversation);
