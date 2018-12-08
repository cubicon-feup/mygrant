import React, { Component } from "react";
import "../css/common.css";
import { Container, Header, Form } from "semantic-ui-react";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';


class CreateAssociation extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        history: ReactRouterPropTypes.history.isRequired
    };


    constructor(props) {
        super(props);
        this.state = {
            associationCreator: "",
            associationName: "",
            mission: "",
            acceptanceCriteria: "",
            jewelry: "",
            share: "",
            date: ""
        };
    }

    componentDidMount() {
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    render() {
        const {
            associationCreator,
            associationName,
            mission,
            acceptanceCriteria,
            jewelry,
            share,
            date
        } = this.state;

        return (
            <Container className="main-container">
                <div>
                    <Header as="h1">Create a Association</Header>
                    <Form onSubmit={this.handleSubmit}>
                    <Form.Input
                            placeholder="Association Creator"
                            name="association Creator"
                            value={associationCreator}
                            onChange={this.handleChange}
                            required
                        />
                        <Form.Input
                            placeholder="Association Name"
                            name="association Name"
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
                            name="acceptance Criteria"
                            value={acceptanceCriteria}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            placeholder="Jewelry"
                            name="jewelry"
                            value={jewelry}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            placeholder="Share"
                            name="share"
                            value={share}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            placeholder="Date"
                            name="date"
                            value={date}
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
