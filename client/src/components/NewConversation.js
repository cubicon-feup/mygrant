import React, { Component } from 'react';
import { Grid, Header, Icon } from 'semantic-ui-react';

class NewConversation extends Component {
    constructor(props) {
        super(props);
        this.state = { email: '' };
    }

    render() {
        return (
            <div className="conversation-card new-conversation" >
                <Grid >
                    <Grid.Column width={2} className="conversation-image">
                        <Icon.Group>
                            <Icon name="conversation" size="large" />
                            <Icon corner name="plus" size="large" />
                        </Icon.Group>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <Header as={'h4'} >{'New Conversation'}</Header>
                        <Header.Subheader>{'Create a new conversation'}</Header.Subheader>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default NewConversation;
