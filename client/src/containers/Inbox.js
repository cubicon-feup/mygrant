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

        this.state = { messages: [] };

        const { cookies } = this.props;
        this.idToken = cookies.get('id_token');

        const headers = { Authorization: `Bearer ${this.idToken}` };

        // Get messages from the database
        //fetch('/api/messages/as_options', { headers })
        //    .then(res => console.log(res))
    }

    render() {
        return (
            <div>
                <Container className="main-container inbox">
                    <NewConversation />
                    <ConversationCard
                        user={{
                            id: 69,
                            name: 'Kanye',
                            picture: '/images/users/kwest.jpg'
                        }}
                        lastMessage={{
                            content: 'Poopity Scoop',
                            date: '15:00',
                            id: 1234
                        }}
                    />
                </Container>
            </div>
        );
    }
}

export default withCookies(Inbox);
