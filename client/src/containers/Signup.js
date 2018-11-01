import React, { Component } from 'react';
import '../css/Signup.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Button, Container, Form, Header, Input, Modal, Message, Responsive } from 'semantic-ui-react';
import { MygrantDivider } from '../components/Common';
import PidgeonMaps from '../components/Map';
import SearchLocation from '../components/SearchLocation';

class SignUp extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        history: ReactRouterPropTypes.history.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            emailError: false,
            errorMessage: '',
            formError: false,
            latitude: '',
            longitude: '',
            name: '',
            password: '',
            passwordError: false,
            phone: '',
            phoneError: false,
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
            passwordError: false,
            phoneError: false
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
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            name: this.state.name,
            password: this.state.password,
            phone: this.state.phone,
            country_id: "184"
        };

        fetch('/api/auth/signup', {
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' },
            method: 'POST'
        }).then(res => {
            if (res.status === 201) {
                // User created - redirect to more info
                this.props.history.push('/');
            } else if (res.status === 409) {
                // Email or phone already in use
                this.setState({
                    emailError: true,
                    errorMessage: 'email or phone already in use',
                    formError: true,
                    phoneError: true
                });
            }
        });
    }

    handleLocationChange = data => {
        this.setState({
            latitude: data.latitude,
            longitude: data.longitude
        });
    };

    handleMapChange = latlng => {
        this.setState({
            latitude: latlng[0],
            longitude: latlng[1]
        });
    };

    renderMap() {
        return (
            <Modal trigger={<Button fluid content={'open map'.toUpperCase()} />}>
                <Modal.Content>
                    <PidgeonMaps handleChange={this.handleMapChange} />
                </Modal.Content>
            </Modal>
        );
    }

    render() {
        return (
            <div>
                <Responsive as={'div'} maxWidth={768} >
                    <Container fluid className="signup-title-container" >
                        <Header as={'h1'}>{'create'.toLowerCase()}<br/>{'an account'.toLowerCase()}</Header>
                    </Container>
                </Responsive>
                <Responsive as={MygrantDivider} maxWidth={768} color="green" />
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
                                label={'name'.toUpperCase()}
                                name="name"
                                type="text"
                                placeholder="Name"
                                onChange={this.handleInput.bind(this)}
                            />
                            <Form.Field required >
                                <label>{'phone number'.toUpperCase()}</label>
                                <Input
                                    error={this.state.phoneError}
                                    name="phone"
                                    type="text"
                                    placeholder="Phone Number"
                                    onChange={this.handleInput.bind(this)}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>{'location'.toUpperCase()}</label>
                                <SearchLocation handleChange={this.handleLocationChange} />
                            </Form.Field>
                            <Form.Field required >
                                <label>{'password'.toUpperCase()}</label>
                                <Input
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
                            {this.renderMap()}
                            <Button circular fluid className={'mygrant-button'} content={'sign up'.toUpperCase()}></Button>
                        </Form>
                    </div>
                </Container>
            </div>
        );
    }
}

export default withCookies(SignUp);
