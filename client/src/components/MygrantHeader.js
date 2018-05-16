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
        }

        this.setState({ user });
    }

    render() {
        return (
            <Menu className="site-header" fixed="top">
                <Menu.Item header as="h2" name="mygrant" ><Link to="/">mygrant</Link></Menu.Item>
                {
                    this.state.user.userId
                        ? <Menu.Item >
                                <Link to={`/user/${this.state.user.userId}`} >
                                    {
                                        this.state.user.image_url
                                            ? <Image avatar src={'/api/images/users/kwest.jpg'} size={'mini'} />
                                            : <Icon name="user circle outline" color={'black'} size={'big'} />
                                    }
                                    <strong>{this.state.user.fullName}</strong>
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
                        ? null
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
