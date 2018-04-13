import React, { Component } from 'react';
import logo from './../logo.svg';
import '../css/App.css';

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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">
          {this.state.info.appName} developed for {this.state.info.client} by {this.state.info.company}
          </h1>
        </header>
      </div>
    );
  }
}

export default App;
