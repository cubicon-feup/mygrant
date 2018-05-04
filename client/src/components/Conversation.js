import React, { Component } from 'react';
import { instanceOf } from 'prop-types';

class Conversation extends Component {
    static propTypes = { user: instanceOf(Object).isRequired };
    
    render() {
        return null;
    }
}

export default Conversation;
