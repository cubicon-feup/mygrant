import React, { Component } from 'react';
import '../css/App.css';

import { Container, Header, Segment, Form } from 'semantic-ui-react';

const urlForData = id => `http://localhost:3001/api/services/${id}`;

class Service extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestFailed: false,
            id: this.props.id,
            title: 'Cortar a relva',
            category: 'Jardim',
            location: 'Aldoar',
            acceptable_radius: '5km',
            mygrant_value: '5',
            service_type: 'PROVIDE',
            request: ''
        };
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleSubmit = event => {
        this.setState({
            request: ''
        });
        alert(
            JSON.stringify({
                id: this.state.id,
                userID: 'logged.in.user.id',
                request: this.state.request
            })
        );
    };

    render() {
        return (
            <Container>
                <Segment>
                    <Header as="h1">{this.state.title}</Header>
                    <p>{this.state.category}</p>
                    <p>{this.state.description}</p>
                    <p>{this.state.location}</p>
                    <p>{this.state.acceptable_radius}</p>
                    <p>{this.state.mygrant_value}</p>
                    <p>{this.state.service_type}</p>
                    <h5>Request Date</h5>
                    <Form method="POST" onSubmit={this.handleSubmit}>
                        <Form.Input
                            labelPosition="right"
                            type="date"
                            placeholder="Request Date"
                            name="request"
                            value={this.state.request}
                            onChange={this.handleChange}
                        />
                        <Form.Button content="Request" />
                    </Form>
                </Segment>
            </Container>
        );
    }
}

export default Service;
