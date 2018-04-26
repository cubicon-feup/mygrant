import React, { Component } from 'react';
import '../css/common.css';

import { Button, Container, Form, Header } from 'semantic-ui-react';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: '', 
            name: '',
            password: '', 
            phone:'',
            repeatPassword: '',
            passwordError: false
        };
    }

    componentDidMount() {
    }

    handleInput(event, data) {
        this.setState({ [data.name]: data.value });
        console.log(this.state);
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

        const data = { 
            email: this.state.email, 
            name: this.state.name,
            password: this.state.password,
            phone: this.state.phone
        };

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
                            onChange={this.handleInput.bind(this)}
                        />
                        <Form.Input 
                            required
                            label={"Your Name".toUpperCase()} 
                            name="name"
                            type="text" 
                            placeholder="Name"
                            onChange={this.handleInput.bind(this)}
                        />
                        <Form.Input 
                            required
                            label={"Your phone number".toUpperCase()} 
                            name="phone"
                            type="text" 
                            placeholder="Phone Number"
                            onChange={this.handleInput.bind(this)}
                        />
                        <Form.Input 
                            required
                            label={"Your password".toUpperCase()} 
                            type="password" 
                            name="password"
                            placeholder="Type your password"
                            error={this.state.passwordError}
                            onChange={this.handleInput.bind(this)}
                        />
                        <Form.Input 
                            required
                            name="repeatPassword"
                            label={"repeat your password".toUpperCase()}
                            type="password" 
                            placeholder="Type your password"
                            error={this.state.passwordError}
                            onChange={this.handleInput.bind(this)}
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
