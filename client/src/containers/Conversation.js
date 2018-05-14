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
                        <Grid.Row streched >
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
                        <Grid.Row>
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
                        <Grid.Row>
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
                    </Grid>
                </Container>
            </div>
        )
    }

}

export default withCookies(Conversation);
