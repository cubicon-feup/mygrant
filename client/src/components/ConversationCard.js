import React, { Component } from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { instanceOf } from 'prop-types';

class ConversationCard extends Component {
    static propTypes = {
        lastMessage: instanceOf(Object).isRequired,
        user: instanceOf(Object).isRequired
    };

    render() {
        return (
            <div className="conversation-card" >
                <Link to={`/conversation/${this.props.user.id}`} >
                    <Grid >
                        <Grid.Column width={3} className="conversation-image">
                            <Image avatar src={this.props.user.picture} />
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <Header as={'h4'} >{this.props.user.name}</Header>
                            <Header.Subheader>{this.props.lastMessage.content}</Header.Subheader>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <Header.Subheader>{this.props.lastMessage.date}</Header.Subheader>
                        </Grid.Column>
                    </Grid>
                </Link>
            </div>
        );
    }
}

export default ConversationCard;
