import React, { Component } from 'react';
import '../css/common.css';

import { Button, Container, Form, Header } from 'semantic-ui-react';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            disableSubmit: true, 
            email: '', 
            emailError: false, 
            password: '', 
            passwordError: false, 
            repeatPassword: ''
        };
    }

    componentDidMount() {
    }

    handleEmailInput(event) {
        this.setState({
            email: event.target.value,
            disableSubmit: this.checkForm()
        });
    }

    handlePasswordInput(event, data) {
        this.setState({
            password: data.value,
            disableSubmit: this.checkForm(),
            passwordError: !this.checkPasswords()
        });
    }

    handleRepeatPasswordInput(event, data) {
        this.setState({
            repeatPassword: data.value,
            disableSubmit: this.checkForm(),
            passwordError: !this.checkPasswords()
        });
    }

    /*
     * Check if the passwords match
     * returns true if the passwords match and are valid
     */
    checkPasswords() {
        console.log(this.state);
        console.log(this.state.password.length >= 8 && this.state.password === this.state.repeatPassword)
        return (this.state.password.length >= 8 && this.state.password === this.state.repeatPassword);
    }

    /*
     * Check input validity
     */
    checkForm() {
        return !this.checkPasswords() || this.state.email === '';
    }

    render() {
        return (
            <Container className="main-container">
                <div>
                    <Header as="h1">create an account</Header>
                    <Form >
                        <Form.Input 
                            required
                            label={"Your Email".toUpperCase()} 
                            type="email" 
                            name="email"
                            placeholder="you@email.com"
                            onBlur={this.handleEmailInput.bind(this)}
                        />
                        <Form.Input 
                            required
                            label={"Your password".toUpperCase()} 
                            type="password" 
                            name="password"
                            placeholder="Type your password"
                            onChange={this.handlePasswordInput.bind(this)}
                            error={this.state.passwordError}
                        />
                        <Form.Input 
                            required
                            label={"repeat your password".toUpperCase()}
                            onChange={this.handleRepeatPasswordInput.bind(this)} 
                            type="password" 
                            placeholder="Type your password"
                            error={this.state.passwordError}
                        />
                        <Button disabled={this.state.disableSubmit}>
                            Sign Up
                        </Button>
                    </Form>
                </div>
            </Container>
        );
    }
}

export default SignUp;
