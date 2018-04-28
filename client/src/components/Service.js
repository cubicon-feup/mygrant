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
//TODO: check urlForCreateOffer
const urlForCreateOffer = id =>
    'http://localhost:3001/api/services/' + id + '/offers';

class Service extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.getID(),
            service: {},
            request: '',
            isFetching: true
        };
    }

    getID() {
        return this.props.id ? this.props.id : this.props.match.params.id;
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

    //TODO: Check body of the message
    handleSubmit = e => {
        e.preventDefault();
        fetch(urlForCreateOffer(this.state.id), {
            method: 'POST',
            body: JSON.stringify({
                service_id: this.state.id,
                partner_id: this.props.idUser,
                date_scheduled: this.state.request
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(result => {
                result.json();
            })
            .then(
                result => {
                    this.setState({ request: '' });
                },
                () => {
                    console.log('ERROR');
                }
            );
    };

    oppositeServiceType() {
        if (this.state.service.service_type === 'PROVIDE') {
            return 'Request';
        } else if (this.state.service.service_type === 'REQUEST') {
            return 'Provide';
        }
    }

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

        return (
            <Container className="main-container">
                <Segment>
                    <Header as="h1">
                        {this.state.service.service_type +
                            ': ' +
                            this.state.service.title}
                    </Header>
                    <p>{this.state.service.category}</p>
                    <p>{this.state.service.description}</p>
                    <p>{this.state.service.location}</p>
                    <p>{this.state.service.acceptable_radius}</p>
                    <p>{this.state.service.mygrant_value}</p>
                    <h5>{this.oppositeServiceType()} Date</h5>
                    <Form method="POST" onSubmit={this.handleSubmit}>
                        <Form.Input
                            type="datetime-local"
                            name="request"
                            value={this.state.request}
                            onChange={this.handleChange}
                        />
                        <Form.Button content={this.oppositeServiceType()} />
                    </Form>
                    <Modal
                        className="modal-container"
                        trigger={<Button>Offers</Button>}
                    >
                        <ServiceOffer
                            idService={this.state.id}
                            typeService={this.state.service.service_type}
                        />
                    </Modal>
                </Segment>
            </Container>
        );
    }
}

export default Service;
