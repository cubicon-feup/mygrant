import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Container, Button, Card, Image, Form } from 'semantic-ui-react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class DonatedCrowdfunding extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    
    componentDidMount() {

    }

    render() {
        return (
            <Container>

            </Container>
        )
    }
}

export default withCookies(DonatedCrowdfunding);