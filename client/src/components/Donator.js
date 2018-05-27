import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Image,  Label } from 'semantic-ui-react';

class Donator extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid stackable columns={3} textAlign="center">
                <Grid.Column width={3}>
                    <Image size='tiny' src='/img/user.jpg' />
                </Grid.Column>

                <Grid.Column width={7}>
                    <Link to="/crowdfunding/500">{this.props.donator.donator_name}</Link>
                </Grid.Column>

                <Grid.Column width={6}>
                    <Label  floated="right">{this.props.donator.amount} MyGrants</Label>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Donator;
