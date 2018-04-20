import React, { Component } from 'react';
import '../css/App.css';
import ServiceOffer from './ServiceOffers';

import {
    Container,
    Header,
    Segment,
    Form,
    Loader,
    Modal,
    Button
} from 'semantic-ui-react';

const urlForData = id => 'http://localhost:3001/api/services/' + id;

class Service extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            service: { data: [{}] },
            request: '',
            requestFailed: false,
            isFetching: true
        };
    }

    componentDidMount() {
        fetch(urlForData(this.state.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({ service: result, isFetching: false });
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
        if (this.state.isFetching) {
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
            <Container className="main-container">
                <Segment>
                    <Header as="h1">{this.state.service.data.title}</Header>
                    <p>{this.state.service.data.category}</p>
                    <p>{this.state.service.data.description}</p>
                    <p>{this.state.service.data.location}</p>
                    <p>{this.state.service.data.acceptable_radius}</p>
                    <p>{this.state.service.data.mygrant_value}</p>
                    <p>{this.state.service.data.service_type}</p>
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
                    <Modal
                        className="modal-container"
                        trigger={<Button>Offers</Button>}
                    >
                        <ServiceOffer idService={this.state.id} />
                    </Modal>
                </Segment>
            </Container>
        );
    }
}

export default Service;
