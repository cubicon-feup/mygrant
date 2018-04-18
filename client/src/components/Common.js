import React, { Component } from 'react';
import { Container, Divider, Icon, Header, Menu } from 'semantic-ui-react';
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

class MygrantDivider extends Component {
    render() {
        return (
            <div class={`mygrant-divider ${this.props.color}`}>
                <Divider className="first-divider"  />
                <Divider className="second-divider" />
            </div>
        );
    }
}

class MygrantFooter extends Component {
    render() {
        return (
            <div>
                <Container className="site-footer">
                <Header size="huge" >mygrant</Header>
                <MygrantDivider color="green" />
                    <Header.Subheader textAlign="center" ><Icon className="far fa-copyright" /> Cubicon {new Date().getFullYear()}</Header.Subheader>
                </Container>
            </div>
        );
    }
}

class MygrantNav extends Component {
    render() {
        return (
            <Menu borderless className="site-nav-mobile" fixed="bottom" textAlign="center" >
                <Menu.Item header as="h2" textAlign="center" name="mygrant" >mygrant</Menu.Item>
            </Menu>
        );
    }
}

export {
    MygrantDivider,
    MygrantFooter,
    MygrantHeader,
    MygrantNav
};
