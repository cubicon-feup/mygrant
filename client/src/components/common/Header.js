import React, { Component } from 'react';
import { Menu, Container } from 'semantic-ui-react';
// import '../../css/common.css';

class Header extends Component {
    render() {
        return (
            <Menu>
                <Menu.Item header name="mygrant" >Mygrant</Menu.Item>
                <Menu.Item position="right">Login</Menu.Item>
                <Menu.Item>Sign Up</Menu.Item>
            </Menu>
        );
    }
}

export default Header;


