import React, { Component } from "react";
import "../css/common.css";
import { Container, Header, Form } from "semantic-ui-react";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';

const urlForCreate = 'http://localhost:3001/api/associations/createassociation';

class CreateAssociation extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        history: ReactRouterPropTypes.history.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            acceptanceCriteria: '',
            associationName: '',
            creatorId: 1001,
            initialFee: '',
            mission: '',
            monthlyFee: ''
        };
    }

    componentDidMount() {
        const { cookies } = this.props;
        this.setState({ creatorId: parseInt(cookies.get('user_id'), 10) });
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleSubmit = () => {
        const { cookies } = this.props;
        fetch(urlForCreate, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.get('id_token')}`
            },
            body: JSON.stringify({
                associationName: this.state.associationName,
                acceptanceCriteria: this.state.acceptanceCriteria,
                creatorId: this.state.creatorId,
                mission: this.state.mission,
                initialFee: this.state.initialFee,
                monthlyFee: this.state.monthlyFee
            })
        }).then(res => {
            if (res.status === 201) {
                res.json()
                    .then(data => {
                        this.props.history.push(`/association/${data.id}`);
                    })
            }
        })
    }

    render() {
        const {
            associationName,
            mission,
            acceptanceCriteria,
            initialFee,
            monthlyFee
        } = this.state;

        return (
            <Container className="main-container">
                <div>
                    <Header as="h1">Create an Association</Header>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Input
                            placeholder="Association Name"
                            name="associationName"
                            value={associationName}
                            onChange={this.handleChange}
                            required
                        />
                        <Form.Input
                            placeholder="Mission"
                            name="mission"
                            value={mission}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            placeholder="Acceptance Criteria"
                            name="acceptanceCriteria"
                            value={acceptanceCriteria}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            placeholder="Initial Fee"
                            name="initialFee"
                            value={initialFee}
                            type="number"
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            placeholder="Monthly Fee"
                            name="monthlyFee"
                            value={monthlyFee}
                            type="number"
                            onChange={this.handleChange}
                        />
                        <Form.Button content="Create Association" />
                    </Form>
                </div>
            </Container>
        );
    }
}

export default withCookies(CreateAssociation);
