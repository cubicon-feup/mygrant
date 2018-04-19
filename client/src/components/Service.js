import React, { Component } from 'react';
import '../css/App.css';

import { Container, Header, Segment, Form, Loader } from 'semantic-ui-react';

const urlForData = id => `http://localhost:3001/api/services/${id}`;

class Service extends Component {
    constructor(props) {
        super(props);
        this.state = {
            service: { data: [{}] },
            request: '',
            requestFailed: false
        };
    }

    componentDidMount() {
        fetch(urlForData(this.props.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({ service: result });
                },
                () => {
                    console.log('ERROR');
                }
            );
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
        if (!this.state.service.data[0].title) {
            return (
                <Container className="main-container">
                    <div>
                        <Loader active inline="centered" />
                    </div>
                </Container>
            );
        }

        if (this.state.requestFailed) {
            return (
                <Container className="main-container">
                    <div>
                        <h1>Request Failed</h1>
                    </div>
                </Container>
            );
        }

        return (
            <Container>
                <Segment>
                    <Header as="h1">{this.state.service.data[0].title}</Header>
                    <p>{this.state.service.data[0].category}</p>
                    <p>{this.state.service.data[0].description}</p>
                    <p>{this.state.service.data[0].location}</p>
                    <p>{this.state.service.data[0].acceptable_radius}</p>
                    <p>{this.state.service.data[0].mygrant_value}</p>
                    <p>{this.state.service.data[0].service_type}</p>
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
