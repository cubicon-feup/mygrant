import React, { Component } from 'react';
import { Menu, Container, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import '../css/common.css';


class MygrantHeader extends Component {
    render() {
        return (
            <Menu className="site-header" fixed="top">
                <Menu.Item header as="h2" name="mygrant" ><Link to="/">mygrant</Link></Menu.Item>
                <Menu.Item position="right">
                    <Link to="/login">
                        <strong>Login</strong>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to="/signup">
                        <strong>Sign Up</strong>
                    </Link>
                </Menu.Item>
            </Menu>
        );
    }
}

class MygrantFooter extends Component {
    render() {
        return (
            <Container className="site-footer">
                <Header as="h3">Mygrant</Header>
                <p>This is the footer</p>
            </Container>
        );
    }
}

export {
    MygrantHeader,
    MygrantFooter
};
