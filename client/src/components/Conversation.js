import React, { Component } from 'react';
import { Grid, Header, Image } from 'semantic-ui-react';
import { instanceOf } from 'prop-types';

class Conversation extends Component {
    static propTypes = {
        date: instanceOf(String).isRequired,
        lastMessage: instanceOf(String).isRequired,
        user: instanceOf(Object).isRequired
    };

    render() {
        console.log(this.props);
        return (
            <div className="conversation" >
                <Grid >
                    <Grid.Column width={3} className="conversation-image">
                        <Image avatar src={this.props.user.picture} />
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <Header as={"h4"} >{this.props.user.name}</Header>
                        <Header.Subheader>{this.props.lastMessage}</Header.Subheader>
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Header.Subheader>{this.props.date}</Header.Subheader>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default Conversation;
