import React, { Component } from 'react';
import '../css/Signup.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Container, Card, Icon } from 'semantic-ui-react';

const urlForAssociation = '/api/associations/';

class Association extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        history: ReactRouterPropTypes.history.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
          associations: null,
          requestFailed: false
          };
    }

    componentDidMount () {
        this.getData();
    }

    getData() {
        fetch(urlForAssociation)
        .then(response => {
            if (!response.ok) {
                throw Error('Network request failed');
            }

            return response;
        })
        .then(result => result.json())
        .then(result => {
            this.setState({ associations: result });
        }, () => {
            // "catch" the error
            this.setState({ requestFailed: true });
        });
    }

    renderAssociations = () => {
        const rows = [];
        const {associations} = this.state;

        associations.forEach((association) => {
          const element = (
            <Card>
                <Card.Content header={association.data.ass_name} />
                <Card.Content description={this.state.association.data.missao} />
                <Card.Content extra>
                <Icon name='user' />
                {association.data.id_creator}
                </Card.Content>
            </Card>
          );
          rows.push(element);
        });

        return rows;
      };

    render() {
        return (
            <Container className="main-container">
                <div><h1>Associations</h1></div>
                {console.log(this.state.associations)/* {this.renderAssociations()} */}
            </Container>
        );
    }
}

export default withCookies(Association);
