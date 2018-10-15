import React, { Component } from 'react';
import '../css/App.css';

import {
    Button,
    Card,
    Container,
    Header,
    Image,
    Loader,
    Modal,
    Segment
} from 'semantic-ui-react';
import User from './User';

const urlForData = id => `/api/services/${id}/offers`;
const urlForUser = id => `/api/users/${id}`;
const urlForAccept = id => `/api/services/${id}/offers/accept`;
const urlForDecline = id => `/api/services/${id}/offers/decline`;

class AnswerProposal extends Component {
    handleClick = accept => e => {
        const { cookies } = this.props;
        e.preventDefault();

        var urlToUser = accept
            ? urlForAccept(this.props.idService)
            : urlForDecline(this.props.idService);

        fetch(urlToUser, {
            method: 'POST',
            body: JSON.stringify(this.props.idUser),
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
                'Content-Type': 'application/json'
            }
        }).then(result => {
            result.json();
        });
    };

    render() {
        return (
            <Card.Content extra>
                <div className="ui two buttons">
                    <Button
                        basic
                        color="green"
                        onClick={this.handleClick(true)}
                    >
                        Approve
                    </Button>
                    <Button basic color="red" onClick={this.handleClick(false)}>
                        Decline
                    </Button>
                </div>
            </Card.Content>
        );
    }
}

class OffersListHeader extends Component {
    render() {
        if (this.props.typeService === 'REQUEST') {
            return <Header as="h1">Users offered to do the service</Header>;
        } else if (this.props.typeService === 'PROVIDE') {
            return <Header as="h1">Users that asked for the service</Header>;
        }
        return 'ERROR';
    }
}

class ServiceOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offers: [{}],
            images: [{}],
            request: '',
            requestFailed: false,
            isFetching: true
        };
    }

    componentDidMount() {
        fetch(urlForData(this.props.idService))
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
                        offers: result,
                        isFetching: false
                    });
                    this.getUserImages();
                },
                () => {
                    console.log('ERROR', 'Failed to get offer data.');
                }
            );
    }

    // TODO: fix get images
    getUserImages() {
        this.state.offers.map(offer =>
            fetch(urlForUser(offer.requester_id))
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
                            images: [[offer.requester_id]: result],
                            isFetching: false
                        });
                    },
                    () => {
                        console.log('ERROR', 'Failed to get user image.');
                    }
                )
        );
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

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

        var allCards = this.state.offers.map(offer =>
            <Card>
                <Modal
                    className="modal-container"
                    trigger={
                        <Card.Content>
                            <Image
                                floated="left"
                                size="mini"
                                src="/assets/images/avatar/large/steve.jpg"
                            />
                            <Card.Header>{offer.requester_name}</Card.Header>
                        </Card.Content>
                    }
                >
                    <Modal.Content>
                        <Segment>
                            <User id={offer.requester_id} />
                        </Segment>
                    </Modal.Content>
                    <Modal.Actions>
                        <AnswerProposal
                            idUser={offer.requester_id}
                            idService={this.props.idService}
                        />
                    </Modal.Actions>
                </Modal>
            </Card>
        );

        return (
            <Container>
                <Segment>
                    <OffersListHeader typeService={this.props.typeService} />
                    <Card.Group>{allCards}</Card.Group>
                </Segment>
            </Container>
        );
    }
}

export default ServiceOffer;
