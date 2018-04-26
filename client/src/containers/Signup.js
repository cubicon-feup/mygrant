import React, { Component } from 'react';
import '../css/common.css';

import { Button, Container, Form, Header } from 'semantic-ui-react';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = { 
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
        });
    }

    handlePasswordInput(event, data) {
        this.setState({
            password: data.value
        });
    }

    handleRepeatPasswordInput(event, data) {
        this.setState({
            repeatPassword: data.value,
        });
    }

    /*
     * Check if the passwords match
     * returns true if the passwords match and are valid
     */
    checkPasswords() {
        return (this.state.password.length >= 8 && this.state.password === this.state.repeatPassword);
    }

    /*
     * Submit the form
     */
    submitForm(event){
        if (!this.checkPasswords()) {
            this.setState({ passwordError: true });
            console.log(this.state);
            return;
        };

        const data = { email: this.state.email, password: this.state.password };

        fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            }
        }).then(res => console.log(res));
    }

    render() {
        return (
            <Container className="main-container">
                <div>
                    <Header as="h1">create an account</Header>
                    <Form onSubmit={this.submitForm.bind(this)} >
                        <Form.Input 
                            required
                            label={"Your Email".toUpperCase()} 
                            type="email" 
                            name="email"
                            placeholder="you@email.com"
                            onBlur={this.handleEmailInput.bind(this)}
                        />
                        { /* TODO handle input */ }
                        <Form.Input 
                            required
                            label={"Your Name".toUpperCase()} 
                            type="text" 
                            placeholder="Name"
                        />
                        { /* TODO handle input */ }
                        <Form.Input 
                            required
                            label={"Your phone number".toUpperCase()} 
                            type="text" 
                            placeholder="Phone Number"
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
                        <Button >
                            Sign Up
                        </Button>
                    </Form>
                </div>
            </Container>
        );
    }
}

export default SignUp;
