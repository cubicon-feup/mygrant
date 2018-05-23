import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Container, Header, Grid, Divider, Image, Icon, Item, Rating, Loader,Progress, Responsive, Form} from 'semantic-ui-react';

class Candidate extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = {
            candidate: this.props.candidate
        }
    }
    
    componentDidMount() {

    }

    render() {

        return (
            <Container>
                <p>cenas</p>
            </Container>
        )
    }
}

export default withCookies(Candidate);