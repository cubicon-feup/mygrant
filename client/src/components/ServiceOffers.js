import React, { Component } from 'react';
import '../css/App.css';

import {
    Container,
    Header,
    Segment,
    Modal,
    Button,
    Loader,
    Card
} from 'semantic-ui-react';
import User from './User';

const urlForData = id => 'http://localhost:3001/api/services/' + id + '/offers';
const urlForAccept = id =>
    'http://localhost:3001/api/services/' + id + '/offers/accept';
const urlForDecline = id =>
    'http://localhost:3001/api/services/' + id + '/offers/decline';

class AnswerProposal extends Component {
    handleAcceptClick = e => {
        e.preventDefault();
        fetch(urlForAccept(this.props.idService), {
            method: 'POST',
            body: JSON.stringify(this.props.idUser),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(result => {
            result.json();
        });
    };

    handleDeclineClick = e => {
        e.preventDefault();
        fetch(urlForDecline(this.props.idService), {
            method: 'POST',
            body: JSON.stringify(this.props.idUser),
            headers: {
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
                        onClick={this.handleAcceptClick}
                    >
                        Approve
                    </Button>
                    <Button basic color="red" onClick={this.handleDeclineClick}>
                        Decline
                    </Button>
                </div>
            </Card.Content>
        );
    }
}

class ServiceOffer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            offers: [{}],
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
                    this.setState({ offers: result, isFetching: false });
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

        var allCards = this.state.offers.map(offer => (
            <Card>
                <Modal
                    className="modal-container"
                    trigger={<Card.Content header={offer.requester_name} />}
                >
                    <User id={offer.requester_id} />
                    <AnswerProposal
                        idUser={offer.requester_id}
                        idService={this.props.idService}
                    />
                </Modal>
            </Card>
        ));

        return (
            <Container>
                <Segment>
                    <Header as="h1">Users that offered to the service</Header>
                    <Card.Group>{allCards}</Card.Group>
                </Segment>
            </Container>
        );
    }
}

export default ServiceOffer;
