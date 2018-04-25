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
            repeatPasswordError: false,
        };
    }

    componentDidMount() {
    }

    handleEmailInput(event) {
        this.setState({email: event.target.value});
    }

    handlePasswordInput(event, data) {
        this.setState({
            password: data.value,
            passwordError: data.value.length < 8
        });
    }

    /*
     * Check if the passwords match
     */
    checkPasswords(event, data) {
        const passwordsMatch = (data.value === this.state.password);
        
        this.setState({ 
            passwordError: (!passwordsMatch || this.state.password.length < 8),
            repeatPasswordError: !passwordsMatch,
            disableSubmit: (this.state.passwordError || this.state.email === '')
        });
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
                            onChange={this.checkPasswords.bind(this)} 
                            type="password" 
                            placeholder="Type your password"
                            error={this.state.repeatPasswordError}
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
