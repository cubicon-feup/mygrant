import React, { Component } from 'react';
import { instanceOf, PropTypes } from 'prop-types';
import { Container, Divider, Icon, Header, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

class MygrantDivider extends Component {
    static propTypes = { color: String }

    render() {
        return (
            <div className={`mygrant-divider ${this.props.color}`}>
                <Divider className="first-divider" />
                <Divider className="second-divider" />
            </div>
        );
    }
}

class MygrantDividerRight extends Component {
    static propTypes = { color: String }

    render() {
        return (
            <div className={`mygrant-divider ${this.props.color}`}>
                <Divider className="first-divider" />
            </div>
        );
    }
}

class MygrantDividerLeft extends Component {
    static propTypes = { color: String }

    render() {
        return (
            <div className={`mygrant-divider ${this.props.color}`}>
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
                <MygrantDivider color="light-green" />
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
    MygrantDividerRight,
    MygrantDividerLeft,
    MygrantFooter,
    MygrantNav
};
