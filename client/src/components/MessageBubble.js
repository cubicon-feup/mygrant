import React, { Component } from 'react';
import { instanceOf, PropTypes } from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';

class MessageBubble extends Component {
    static propTypes = {
        incoming: PropTypes.boolean,
        message: instanceOf(Object).isRequired
    };

    render() {
        return (
            <div>
                <Segment
                    className={`message-bubble ${this.props.incoming ? 'incoming' : 'outgoing'}`}
                    compact
                    floated={this.props.incoming ? 'left' : 'right' }
                >
                    <p className="content">
                        {this.props.message.content}
                    </p>
                </Segment>
                <Header as={'h5'} textAlign={this.props.incoming ? 'left' : 'right'} >{this.props.message.date}</Header>
            </div>
        );
    }
}

export default MessageBubble;
