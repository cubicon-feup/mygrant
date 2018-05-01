import React, { Component } from 'react';
import '../css/Signup.css';

import { Button, Container, Form, Header, Input } from 'semantic-ui-react';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            password: '',
            passwordError: false,
            phone: '',
            repeatPassword: ''
        };

        this.emailField = null;

        this.setEmailField = component => {
            this.emailField = component;
        };
    }

    // Focus on the email input
    componentDidMount() {
        this.emailField.focus();
    }

    // Update the state with the data that was inserted
    handleInput(event, data) {
        this.setState({ [data.name]: data.value });
    }

    // Check if the passwords match
    // returns true if the passwords match and are valid
    checkPasswords() {
        return this.state.password.length >= 8 && this.state.password === this.state.repeatPassword;
    }

    // Submit the form
    submitForm(event) {
        event.preventDefault();
        if (!this.checkPasswords()) {
            this.setState({ passwordError: true });

            return;
        }

        const data = {
            email: this.state.email,
            name: this.state.name,
            password: this.state.password,
            phone: this.state.phone
        };

        fetch('/api/auth/signup', {
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' },
            method: 'POST'
        }).then(res => console.log(res));
        // TODO: deal with this
    }

    render() {
        return (
            <Container className="signup main-container">
                <div>
                    <Form onSubmit={this.submitForm.bind(this)} >
                        <Form.Field required >
                            <label>{'Your Email'.toUpperCase()}</label>
                            <Input
                                name="email"
                                placeholder="you@email.com"
                                onChange={this.handleInput.bind(this)}
                                ref={this.setEmailField}
                                type="email"
                            />
                        </Form.Field>
                        <Form.Input
                            required
                            label={'Your Name'.toUpperCase()}
                            name="name"
                            type="text"
                            placeholder="Name"
                            onChange={this.handleInput.bind(this)}
                        />
                        <Form.Input
                            required
                            label={'Your phone number'.toUpperCase()}
                            name="phone"
                            type="text"
                            placeholder="Phone Number"
                            onChange={this.handleInput.bind(this)}
                        />
                        <Form.Input
                            required
                            label={'Your password'.toUpperCase()}
                            type="password"
                            name="password"
                            placeholder="Type your password"
                            error={this.state.passwordError}
                            onChange={this.handleInput.bind(this)}
                        />
                        <Form.Input
                            required
                            name="repeatPassword"
                            label={'repeat your password'.toUpperCase()}
                            type="password"
                            placeholder="Type your password"
                            error={this.state.passwordError}
                            onChange={this.handleInput.bind(this)}
                        />
                        <Button circular fluid className={'mygrant-button'} content={'sign up'.toUpperCase()}></Button>
                    </Form>
                </div>
            </Container>
        );
    }
}

export default SignUp;
