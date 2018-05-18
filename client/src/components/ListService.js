import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Image,  Label, Button } from 'semantic-ui-react';

class ListService extends Component {

    constructor(props) {
        super(props);
        console.log(this.props.crowdfunding);
    }

    render() {
        return (
            <Grid stackable centered columns={5} textAlign="center">
                <Grid.Column width={4}>
                    <Image size='small' src='/img/mission.png' />
                </Grid.Column>

                <Grid.Column width={8}>
                    <h4>{this.props.crowdfunding.title}</h4>
                    <p>{this.props.crowdfunding.category}</p>
                </Grid.Column>

                <Grid.Column width={4}>
                    <Label  floated="right">{this.props.crowdfunding.mygrant_value} MyGrants</Label>
                    <Link to={"/crowdfunding/" + this.props.crowdfunding.id}><Button>Details</Button></Link>
                </Grid.Column>
            </Grid>
        );
    }
}

export default ListService;
