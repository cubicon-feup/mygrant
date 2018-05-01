import React, { Component } from 'react';
import '../css/Signup.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Button, Container, Form, Input, Message } from 'semantic-ui-react';

class SignUp extends Component {
    static proptypes = {
        cookies: instanceOf(Cookies).isrequired,
        history: ReactRouterPropTypes.history.isrequired
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailError: false,
            errorMessage: '',
            formError: false,
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
        this.setState({
            [data.name]: data.value,
            emailError: false,
            formError: false,
            passwordError: false
        });
    }

    // Check if the passwords match
    // returns true if the passwords match and are valid
    checkPasswords() {
        return this.state.password === this.state.repeatPassword;
    }

    // Submit the form
    submitForm(event) {
        event.preventDefault();
        if (!this.checkPasswords()) {
            this.setState({
                errorMessage: 'the inserted passwords don\'t match',
                formError: true,
                passwordError: true
            });

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
        }).then(res => {
            if (res.status === 201) {
                // User created - redirect to more info
                this.props.history.push('/signupinfo');
            } else if (res.status === 409) {
                // Email already in use
                this.setState({
                    emailError: true,
                    errorMessage: 'that email is already being used by another account',
                    formError: true
                });
            }
        });
    }

    render() {
        return (
            <Container className="signup main-container">
                <div>
                    <Form error={this.state.formError} onSubmit={this.submitForm.bind(this)} >
                        <Form.Field required >
                            <label>{'email'.toUpperCase()}</label>
                            <Input
                                error={this.state.emailError}
                                name="email"
                                placeholder="you@email.com"
                                onChange={this.handleInput.bind(this)}
                                ref={this.setEmailField}
                                type="email"
                            />
                        </Form.Field>
                        <Form.Input
                            required
                            label={'name'.toUpperCase()}
                            name="name"
                            type="text"
                            placeholder="Name"
                            onChange={this.handleInput.bind(this)}
                        />
                        <Form.Input
                            required
                            label={'phone number'.toUpperCase()}
                            name="phone"
                            type="text"
                            placeholder="Phone Number"
                            onChange={this.handleInput.bind(this)}
                        />
                        <Form.Field >
                            <label>{'password'.toUpperCase()}</label>
                            <Input
                                required
                                type="password"
                                name="password"
                                minLength={8}
                                placeholder="Type your password"
                                error={this.state.passwordError}
                                onChange={this.handleInput.bind(this)}
                            />
                        </Form.Field>
                        <Form.Field >
                            <label>{'repeat your password'.toUpperCase()}</label>
                            <Input
                                required
                                placeholder="Type your password"
                                name="repeatPassword"
                                minLength={8}
                                type="password"
                                error={this.state.passwordError}
                                onChange={this.handleInput.bind(this)}
                            >
                            </Input>
                            <Message
                                error
                                content={this.state.errorMessage}
                            />
                        </Form.Field>
                        <Button circular fluid className={'mygrant-button'} content={'sign up'.toUpperCase()}></Button>
                    </Form>
                </div>
            </Container>
        );
    }
}

export default withCookies(SignUp);
