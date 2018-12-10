import React, { Component } from 'react';
import '../css/Signup.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Container, Card, Icon } from 'semantic-ui-react';

class Association extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        history: ReactRouterPropTypes.history.isRequired
    };

    constructor(props) {
        super(props);
        
        const {associations} = this.props;
        this.state = { associations};
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
                {/* {this.renderAssociations()} */}
            </Container>
        );
    }
}

export default withCookies(Association);
