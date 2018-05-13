import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import Conversation from '../components/Conversation';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';

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
                    <Conversation
                        user={{
                            name: 'Kanye',
                            picture: '/home/epassos/Downloads/kwest.jpg'
                        }}
                        lastMessage={'Poopity Scoop'}
                        date={'15:00'}
                    />
                    <Conversation
                        user={{
                            name: 'Kanye',
                            picture: '/assets/kwest'
                        }}
                        lastMessage={'Poopity Scoop'}
                        date={'15:00'}
                    />
                </Container>
            </div>
        );
    }
}

export default withCookies(Inbox);
