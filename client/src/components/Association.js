import React, { Component } from 'react';
import '../css/Crowdfunding.css';

import { Container, Loader, Header, Grid, Icon, Segment } from 'semantic-ui-react';
import { MygrantDividerLeft, MygrantDividerRight } from './Common';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Link } from 'react-router-dom';
//import ReactRouterPropTypes from 'react-router-prop-types';

const apiPath = require('../config').apiPath;
const urlForAssociation = association_id => '/api/associations/' + association_id;

class Association extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        //history: ReactRouterPropTypes.history.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
          association: this.props.association,
          associationId: this.props.match.params.association_id,
          requestFailed: false
        };
    }

    componentDidMount () {
        this.getData();
    }

    getData() {
        fetch(urlForAssociation(this.state.associationId))
        .then(response => {
            if (!response.ok) {
                throw Error('Network request failed');
            }

            return response;
        })
        .then(result => result.json())
        .then(result => {
            this.setState({ association: result });
        }, () => {
            // "catch" the error
            this.setState({ requestFailed: true });
        });
    }

    render() {

        if (this.state.requestFailed) {
            return (
                <Container className="main-container">
                    <div>
                        <h1>Request Failed</h1>
                    </div>
                </Container>
            );
        }

        if (this.state.association == undefined) {
            return (
                <Container className="main-container">
                    <div>
                        <Loader active inline='centered' />
                    </div>
                </Container>
            );
        }

        return (
            <Container className="main-container">
                <Header as='h1'> Association </Header>
                <Grid columns={2} divided>
                    <Grid.Row>
                    <Grid.Column>
                        <Segment>
                            <Icon name="home" />
                            Name: {this.state.association.data.ass_name}
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment>
                            <Icon name="male" />
                            Creator Id: {this.state.association.data.id_creator}
                        </Segment>
                    </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                    <Grid.Column>
                        <Segment>
                            <Icon name="question circle outline" />
                            Mission: {this.state.association.data.missao}
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment>
                            <Icon name="key" />
                            Entrance Criteria: {this.state.association.data.criterios_entrada}
                        </Segment>
                    </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                    <Grid.Column>
                        <Segment>
                            <Icon name="gem" />
                            Entry fee: {this.state.association.data.joia}
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment>
                            <Icon name="envelope" />
                            Monthly fee: {this.state.association.data.quota}
                        </Segment>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

export default withCookies(Association);
