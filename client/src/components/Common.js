import React, { Component } from 'react';
import { instanceOf, PropTypes } from 'prop-types';
import { Container, Divider, Icon, Header, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

class MygrantHeader extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        userId: PropTypes.int,
        userName: PropTypes.string
    }

    constructor(props) {
        super(props);

    }

    render() {
        const { cookies } = this.props;

        if (cookies.get('id_token')) {
            const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };
            fetch('/api/user/get_from_token', { headers })
                .then(res => res.json()
                    .then(user => {
                        this.setState({ user });
                        console.log(this.state);
                    })
                );
        }

        console.log(this.props.userId);
        return (
            <Menu className="site-header" fixed="top">
                <Menu.Item header as="h2" name="mygrant" ><Link to="/">mygrant</Link></Menu.Item>
                { this.props.userId ?
                <Menu.Item position="right">
                    <Link to="/login">
                        <strong>Login</strong>
                    </Link>
                </Menu.Item>
                        : <strong>{'elo'}</strong>
                }
                { this.props.userId ?
                <Menu.Item>
                    <Link to="/signup">
                        <strong>Sign Up</strong>
                    </Link>
                </Menu.Item>
                        : <strong>{'elo'}</strong>
                }
            </Menu>
        );
    }
}

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
