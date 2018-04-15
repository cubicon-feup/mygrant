import React, { Component } from 'react';
import logo from './../logo.svg';
import '../css/App.css';

class CheckboxWithLabel extends Component {
    constructor(props) {
        super(props);
        this.state = { isChecked: false };
    }

    onClick = e => {
        this.setState({ isChecked: !this.state.checked });
    };

    render() {
        return (
            <label>
                <input
                    type="checkbox"
                    checked={this.state.isChecked}
                    onClick={this.onClick}
                />
                {this.state.isChecked
                    ? this.props.labelOn
                    : this.props.labelOff}
            </label>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { info: [] };
    }

    componentDidMount() {
        fetch('/api/app_info')
            .then(res => res.json())
            .then(info => this.setState({ info }));
    }

    render() {
        return (
            <div className="App">
                <CheckboxWithLabel />
            </div>
        );
    }
}

export default CheckboxWithLabel;
