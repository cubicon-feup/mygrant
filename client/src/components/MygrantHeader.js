import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { Icon, Image, Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { withCookies, Cookies } from 'react-cookie';

class MygrantHeader extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired }

    constructor(props) {
        super(props);

        this.state = { user: {} };

    }

    componentDidMount() {
        const { cookies } = this.props;

        if (cookies.get('id_token')) {
            const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };
            fetch('/api/users/', { headers })
                .then(res => res.json()
                    .then(thisUser => {
                        const { id } = thisUser
                        fetch(`/api/users/${id}`)
                            .then(data => data.json()
                                .then(user => {
                                    this.setState({ user });
                                })
                            )
                    })
                );
        }
    }

    render() {
        return (
            <Menu className="site-header" fixed="top">
                <Menu.Item header as="h2" name="mygrant" ><Link to="/">mygrant</Link></Menu.Item>
                {
                    this.state.user.user_id
                        ? <Menu.Item >
                                <Link to={`/user/${this.state.user.user_id}`} >
                                    {
                                        this.state.user.image_url
                                            ? <Image avatar src={'/api/images/users/kwest.jpg'} size={'mini'} />
                                            : <Icon name="user circle outline" color={'black'} size={'big'} />
                                    }
                                    <strong>{this.state.user.full_name}</strong>
                                </Link>
                            </Menu.Item>
                        : <Menu.Item position="right">
                                <Link to="/login">
                                    <strong>Login</strong>
                                </Link>
                            </Menu.Item>
                }
                {
                    this.state.user.user_id
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
