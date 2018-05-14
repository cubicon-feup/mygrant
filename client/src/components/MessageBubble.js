import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { Segment } from 'semantic-ui-react';

//import '../css/messages.css';

class MessageBubble extends Component {
    static propTypes = {
        incoming: instanceOf(Boolean),
        message: instanceOf(Object).isRequired
    };

    render() {
        return (
            <Segment
                circular
                className={`message-bubble ${this.props.incoming ? 'incoming' : 'outgoing'}`}
                compact
                floated={this.props.incoming ? 'left' : 'right' }
            >
                {this.props.message.content}
            </Segment>
        );
    }
}

export default MessageBubble;
