import React, { Component } from 'react';
import { Button, Container, Form, Header, Icon, Input, Message, Responsive } from 'semantic-ui-react';
import { MygrantDivider } from '../components/Common';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import '../css/Login.css';

class Login extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            formError: false,
            password: ''
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
            formError: false
        });
    }

    // Submit the form
    submitForm(event) {
        event.preventDefault();

        const { cookies } = this.props;

        if (this.state.email === '' || this.state.password === '') {
            this.setState({ formError: true });

            return;
        }

        const data = {
            password: this.state.password,
            username: this.state.email
        };

        fetch('api/auth/login', {
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' },
            method: 'POST'
        }).then(res => {
            if (res.status === 200) {
                res.json()
                    .then(parsed => {
                        cookies.set('id_token', parsed.token, {
                            // httpOnly: true,
                            // secure: true
                            path: '/'
                        });
                    });
            } else {
                this.setState({ formError: true });
            }
        });
    }

    render() {
        return (
            <div>
                <Responsive as={'div'} maxWidth={768} >
                    <Container fluid className="login-title-container" >
                        <Header as={'h1'}>{'Mygrant'.toLowerCase()} </Header>
                    </Container>
                </Responsive>
                <Responsive as={MygrantDivider} maxWidth={768} color="light-purple" />
                <Container className="main-container login">
                    <div>
                        <Form error={this.state.formError} onSubmit={this.submitForm.bind(this)} >
                            <Form.Field >
                                <label>{'email'.toUpperCase()}</label>
                                <Input
                                    error={this.state.formError}
                                    type="email"
                                    name="email"
                                    placeholder="you@email.com"
                                    onChange={this.handleInput.bind(this)}
                                    ref={this.setEmailField}
                                />
                            </Form.Field>
                            <Form.Field >
                                <label>{'password'.toUpperCase()}</label>
                                <Input
                                    error={this.state.formError}
                                    type="password"
                                    name="password"
                                    onChange={this.handleInput.bind(this)}
                                />
                            </Form.Field>
                            <Message
                                error
                                content={'invalid email or password'}
                            />
                            <Button fluid circular className="mygrant-button" content={'log in'.toUpperCase()}></Button>
                            <Button fluid circular color="google plus" verticalAlign="middle" >
                                <Icon name="google" />Log In with Google
                            </Button>
                        </Form>
                    </div>
                </Container>
            </div>
        );
    }
}

export default withCookies(Login);
