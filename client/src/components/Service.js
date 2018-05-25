import React, { Component } from 'react';
import '../css/Service.css';
import ReactRouterPropTypes from 'react-router-prop-types';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ServiceOffer from './ServiceOffers';
import ImgGrid from './ImgGrid';
import UserCard from './UserCard';
import CommentsSection from './Comments';
import PidgeonMaps from './Map';

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

const urlForData = id => `/api/services/${id}`;
const urlForCreateOffer = id => `/api/services/${id}/offers`;

class Service extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        location: ReactRouterPropTypes.location.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            id: this.getID(),
            isFetching: true,
            request: '',
            service: {}
        };
    }

    getID() {
        return this.props.id ? this.props.id : this.props.match.params.id;
    }

    componentDidMount() {
        const { cookies } = this.props;

        this.setState({ userID: parseInt(cookies.get('user_id'), 10) });

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
                    this.setState({
                        service: result,
                        isFetching: false
                    });
                },
                () => {
                    console.log('ERROR', 'Failed to fetch service data.');
                }
            );
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleSubmit = e => {
        const { cookies } = this.props;
        e.preventDefault();

        fetch(urlForCreateOffer(this.state.id), {
            method: 'POST',
            body: JSON.stringify({
                partner_id: this.state.userID,
                date_proposed: this.state.request
            }),
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
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
                    console.log('ERROR', 'Failed to submit the request');
                }
            );
    };

    isOwner() {
        return this.state.service.creator_id === this.state.userID;
    }

    oppositeServiceType() {
        if (this.state.service.service_type === 'PROVIDE') {
            return 'Request';
        } else if (this.state.service.service_type === 'REQUEST') {
            return 'Provide';
        }

        return 'ERROR';
    }

    renderDescGrid() {
        return [
            <Grid key={1} className="desc" container width={5}>
                <Grid.Row>
                    <Grid.Column textAlign="justified">
                        {this.state.service.description}
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2} verticalAlign="bottom">
                    <Grid.Column textAlign="left">
                        <p className="value">
                            <b>{this.state.service.location}</b>
                        </p>
                    </Grid.Column>
                    <Grid.Column textAlign="right">
                        <p className="value">
                            <b>{this.state.service.mygrant_value}</b>
                            <i> mygrants</i>
                        </p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>,
            <UserCard key={2} data={this.state.service} />
        ];
    }

    renderMainGrid() {
        return (
            <Grid className="main" container>
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

    renderOffers() {
        return this.isOwner()
            ? <Modal
                className="modal-container"
                trigger={
                    <Container id="fartop">
                        <Button className="mygrant-button">Offers</Button>
                    </Container>
                }
            >
                <ServiceOffer
                    idUser={this.state.userID}
                    idService={this.state.id}
                    typeService={this.state.service.service_type}
                />
            </Modal>
         : <Container id="fartop">
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
            </Container>;
}

    renderMap() {
        if (this.state.service.latitude && this.state.service.longitude) {
            return (
                <PidgeonMaps
                    latlng={[
                        this.state.service.latitude,
                        this.state.service.longitude
                    ]}
                />
            );
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
            <Container fluid className="main-container">
                <Container>
                    <Header size="huge" textAlign="center">
                        <Icon name="external" />
                        Service Details
                    </Header>
                    <Header as="h2">
                        {`${this.state.service.service_type}: ${
                            this.state.service.title
                        } . `}
                        <h4>{this.state.service.category}</h4>
                    </Header>
                </Container>
                <Container fluid id="purple-divider" />
                {this.renderMainGrid()}
                <Container fluid id="green-divider" />
                {this.renderOffers()}
                {this.renderMap()}
                <CommentsSection type="services" id={this.state.id} />
            </Container>
        );
    }
}

export default withCookies(Service);
