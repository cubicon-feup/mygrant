import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Image,  Label, Button } from 'semantic-ui-react';

class ListCrowdfunding extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid stackable centered columns={5} textAlign="center">
                <Grid.Column width={3}>
                    <Image size='small' src='/img/mission.png' />
                </Grid.Column>

                <Grid.Column width={7}>
                    <h4>{this.props.crowdfunding.title}</h4>
                    <p>{this.props.crowdfunding.category}</p>
                </Grid.Column>

                <Grid.Column width={2}>
                    <Link to="">
                        <Image size='tiny' scr='/img/user.jpg'/>
                        <p>{this.props.crowdfunding.creator_name}</p>
                        <p>rating</p>
                    </Link>
                </Grid.Column>

                <Grid.Column width={2}>
                    <h4>{this.props.crowdfunding.location}</h4>
                </Grid.Column>

                <Grid.Column width={2}>
                    <Label  floated="right">{this.props.crowdfunding.mygrant_target} MyGrants</Label>
                    <Link to={"/crowdfunding/" + this.props.crowdfunding.crowdfunding_id}><Button>Details</Button></Link>
                </Grid.Column>
            </Grid>
        );
    }
}

export default ListCrowdfunding;
