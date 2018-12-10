import React, { Component } from 'react';
import '../css/Crowdfunding.css';

import { Container, Button, Checkbox, Header, Grid, Label, Modal, Icon, Item, Rating, Loader,Progress, Responsive, Form, Radio} from 'semantic-ui-react';
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

        //console.log(this.state.association);

        return (
            <Container className="main-container">
                <h1>Association</h1><hr></hr>
                <h2>{this.state.association.data.ass_name}</h2>
                <b>Creator:{this.state.association.data.id_creator}</b><br></br>
                <b>Missao: {this.state.association.data.missao}</b><br></br>
                <b>Criterios de entrada: {this.state.association.data.criterios_entrada}</b><br></br>
                <b>Joia: {this.state.association.joia}</b><br></br>
                <b>Quota: {this.state.association.quota}</b><br></br>
            </Container>
        );
    }
}

export default withCookies(Association);
