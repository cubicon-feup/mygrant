import React, { Component } from 'react';
import '../css/common.css';

import { Container, Header, Form } from 'semantic-ui-react';

class Signin extends Component {
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
      <Container className="main-container">
        <div>
          <Header as="h1">Sign Up</Header>
          <Form>
            <Form.Input label="Your Name" type="text" placeholder="Name"/>
            <Form.Input label="Your Email" type="email" placeholder="you@email.com"/>
            <Form.Group widths="equal">
                <Form.Input label="City" type="email" placeholder="City"/>
                <Form.Input label="Country" type="email" placeholder="Country"/>
            </Form.Group>
            <Form.Input label="Choose a password" type="password" placeholder="Type your password"/>
            <Form.Input label="Repeat your password" type="password" placeholder="Type your password"/>
          </Form>
        </div>
      </Container>
    );
  }
}

export default Signin;
