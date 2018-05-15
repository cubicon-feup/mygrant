import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import ConversationCard from '../components/ConversationCard';
import NewConversation from '../components/NewConversation';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import '../css/Inbox.css';

class Inbox extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);

        this.state = { conversations: [] };

        const { cookies } = this.props;

        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };

        // Get messages from the database
        fetch('/api/messages/', { headers })
            .then(res => res.json()
                .then(conversationList => {
                    const conversations = [];
                    conversationList.forEach(conv => {
                        conversations.push(
                            <ConversationCard
                                user={{
                                    id: conv.other_user_id,
                                    name: conv.other_user_full_name,
                                    picture: conv.image_url
                                }}
                                lastMessage={{
                                    content: conv.content,
                                    date: conv.date_sent
                                }}
                            />
                        )
                    });
                    this.setState({ conversations });
                }));
    }

    render() {
        return (
            <div>
                <Container className="main-container inbox">
                    <NewConversation />
                    {this.state.conversations}
                </Container>
            </div>
        );
    }
}

export default withCookies(Inbox);
