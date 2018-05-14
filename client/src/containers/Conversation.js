import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import MessageBubble from '../components/MessageBubble';
import { Container, Grid } from 'semantic-ui-react';

import '../css/Conversation.css';

class Conversation extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
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
                </Container>
            </div>
        )
    }

}

export default withCookies(Conversation);
