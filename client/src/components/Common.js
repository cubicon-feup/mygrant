import React, { Component } from 'react';
import { Menu, Container } from 'semantic-ui-react';
// import '../../css/common.css';


class MygrantHeader extends Component {
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

class MygrantFooter extends Component {
    render() {
        return (
            <Menu fixed="bottom">
                <Menu.Item header name="mygrant" >Mygrant</Menu.Item>
            </Menu>
        );
    }
}

export {
    MygrantHeader,
    MygrantFooter
};
