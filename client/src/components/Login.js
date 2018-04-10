import React, { Component } from 'react';
import Header from './common/Header';
import logo from './../logo.svg';
import '../css/App.css';

class Login extends Component {
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
      <Header></Header>
    );
  }
}

export default Login;
