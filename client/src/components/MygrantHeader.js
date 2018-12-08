import React, { Component } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { instanceOf } from 'prop-types';
import { Icon, Image, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

class MygrantHeader extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        location: ReactRouterPropTypes.location.isRequired
    }

    constructor(props) {
        super(props);

        const { cookies } = this.props;
        this.fullName = cookies.get('user_full_name');

        this.state = {
            hasInfo: Boolean(this.fullName),
            user: {}
        };

    }

    componentDidMount() {
        const { cookies } = this.props;

        const user = {
            fullName: cookies.get('user_full_name'),
            userId: cookies.get('user_id')
        };

        this.setState({ user });
    }

    signOut() {
        const { cookies } = this.props;
        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };

        fetch('/api/auth/logout', { headers })
            .then(res => {
                if (res.status === 200) {
                    cookies.remove('id_token');
                    cookies.remove('user_id');
                    cookies.remove('user_full_name');
                    cookies.remove('user_image_url');
                    window.location.reload();
                }
            });
    }

    render() {
        let logoLink;
        if(this.state.user)
            logoLink = "/dashboard";
        else logoLink = "/";

        return (
            <Menu className="site-header" fixed="top">
                <Menu.Item header as="h2" name="mygrant" ><Link to={logoLink}>mygrant</Link></Menu.Item>
                {
                    this.state.user.userId
                        ? <Menu.Item >
                                <Link to={`/user/${this.state.user.userId}`} >
                                    {
                                        this.state.user.image_url
                                            ? <Image avatar src={`/api/images/${this.state.user.image_url}`} size={'mini'} />
                                            : <Icon name="user circle outline" color={'black'} size={'big'} />
                                    }

                                    <strong>{this.state.user.fullName}</strong>
                                </Link>
                            </Menu.Item>
                        : null
                }
                    <Menu.Item>
                        <Link to={'/search'}>Search</Link>
                    </Menu.Item>
                {
                    this.state.user.userId
                        ? <Menu.Item >
                            <Link to={'/Inbox'} >
                                <Icon name={'mail outline'} />
                                </Link>
                            </Menu.Item>
                        : null
                }
                {
                    this.state.user.userId
                        ? <Menu.Item >
                            <Link to={'/Feed'} >
                                    {'My Feed'}
                                </Link>
                            </Menu.Item>
                        : null
                }
                {
                    this.state.user.userId
                        ? <Menu.Item >
                            <Link to={'/crowdfundings'} >
                                    {'Crowdfunding Projects'}
                                </Link>
                            </Menu.Item>
                        : null
                }
                {
                    this.state.user.userId
                        ? <Menu.Item >
                            <Link to={'/polls'} >
                                    {'Polls'}
                                </Link>
                            </Menu.Item>
                        : null
                }
                {
                    this.state.user.userId
                        ? <Menu.Item >
                            <Link to={'/createcrowdfunding'} >
                                    {'Create a Crowdfunding Project'}
                                </Link>
                            </Menu.Item>
                        : null
                }
                {
                    this.state.user.userId
                        ? <Menu.Item >
                            <Link to={'/createservice/PROVIDE'} >
                                    {'Provide a Service'}
                                </Link>
                            </Menu.Item>
                        : null
                }
                {
                    this.state.user.userId
                        ? <Menu.Item >
                            <Link to={'/association'} >
                                    {'Association'}
                                </Link>
                            </Menu.Item>
                        : null
                }
                {
                    this.state.user.userId
                        ? <Menu.Item position="right" onClick={this.signOut.bind(this)}>
                                <strong>Sign Out</strong>
                            </Menu.Item>
                        : <Menu.Item position="right">
                                <Link to="/login">
                                    <strong>Login</strong>
                                </Link>
                            </Menu.Item>
                }
                {
                    this.state.user.userId
                        ? null
                        : <Menu.Item>
                            <Link to="/signup">
                                <strong>Sign Up</strong>
                            </Link>
                        </Menu.Item>
                }
            </Menu>
        );
    }
}


export default withCookies(MygrantHeader);
