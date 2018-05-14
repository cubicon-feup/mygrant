import React, { Component } from 'react';
import { instanceOf, PropTypes } from 'prop-types';
import { Header, Segment } from 'semantic-ui-react';
import moment from 'moment';

class MessageBubble extends Component {
    static propTypes = {
        incoming: PropTypes.bool,
        message: instanceOf(Object).isRequired
    };

    constructor(props) {
        super(props);

        this.messageDate = this.props.message.date;
        if (moment(this.messageDate).isBefore(moment().subtract(1, 'days'))) {
            this.messageDate = moment(this.messageDate).format('ddd, hh:mm');
        } else {
            this.messageDate = moment(this.messageDate).fromNow();
        }
    }

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
                <Header as={'h5'} textAlign={this.props.incoming ? 'left' : 'right'} >{this.messageDate}</Header>
            </div>
        );
    }
}

export default MessageBubble;
