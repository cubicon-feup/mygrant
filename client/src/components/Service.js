import React, { Component } from 'react';
import '../css/Service.css';
import ServiceOffer from './ServiceOffers';
import ImgGrid from './ImgGrid';

import {
    Button,
    Container,
    Form,
    Grid,
    Header,
    Icon,
    Loader,
    Modal
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
                    console.log('ERROR', 'Failed to fetch service data.');
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
        return 'ERROR';
    }

    renderDescGrid() {
        return (
            <Grid className="griddesc" container width={5}>
                <Grid.Row>
                    <Grid.Column textAlign="justified">
                        {this.state.service.description}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} verticalAlign="bottom">
                    <Grid.Column textAlign="left">
                        <p class="value">
                            <b>{this.state.service.location}</b>
                        </p>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <p class="value">
                            <b>{this.state.service.mygrant_value}</b>
                            <i> mygrants</i>
                        </p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    renderMainGrid() {
        return (
            <Grid container>
                <Grid.Row columns={2}>
                    <Grid.Column width={6}>
                        <ImgGrid idService={this.state.id} />
                    </Grid.Column>
                    <Grid.Column stretched width={10}>
                        {this.renderDescGrid()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
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
                <Header size="huge" textAlign="center">
                    <Icon name="external" />
                    Service Details
                </Header>

                <Header as="h2">
                    {this.state.service.service_type +
                        ': ' +
                        this.state.service.title +
                        ' . '}
                    <h4>{this.state.service.category}</h4>
                </Header>

                <Container fluid className="purple-divider" />
                {this.renderMainGrid()}
                <Container fluid className="green-divider" />

                <Header as="h4">{this.oppositeServiceType()} Date</Header>
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
            </Container>
        );
    }
}

export default Service;
