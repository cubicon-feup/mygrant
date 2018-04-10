import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
// import '../../css/common.css';

class Header extends Component {
    render() {
        return (
            <Menu>
                <Menu.Item
                    name="Mygrant"
                >
                Mygrant
                </Menu.Item>
            </Menu>
        );
    }
}

export default Header;


