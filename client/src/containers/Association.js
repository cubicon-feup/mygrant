import React, { Component } from 'react';
import '../css/Signup.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Container, Card, Icon, Segment } from 'semantic-ui-react';

const urlForAssociation = '/api/associations/';

class Association extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        history: ReactRouterPropTypes.history.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            associations: [],
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
            this.setState({ associations: result, loading: false });
        }, () => {
            // "catch" the error
            this.setState({ requestFailed: true });
        });
    }

    renderAssociations = () => {
        const rows = [];
        const {associations} = this.state;

        associations.data.forEach((association) => {
          const element = (
            <Card>
                <Card.Content header={association.ass_name} />
                <Card.Content description={association.missao} />
                <Card.Content extra>
                <Icon name='user' />
                {association.id_creator}
                </Card.Content>
            </Card>
          );
          rows.push(element);
        });

        return rows;
      };

    render() {

        const {loading} = this.state;

        if(loading){
            return (
                <Container className="main-container">
                    <div><h1>Associations</h1></div>
                    <Segment loading={loading}>
                    </Segment>
                </Container>
            );
        }
       
        return (
        <Container className="main-container">
            <div><h1>Associations</h1></div>
            <Segment loading={loading}>
            {this.renderAssociations()}
            </Segment>
        </Container>
);
    }
}

export default withCookies(Association);
