import React, { Component } from "react";
import "../css/common.css";
import { Container, Header, Form } from "semantic-ui-react";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

const urlForCreate = 'http://localhost:3001/api/crowdfundings';

class CreateCrowdfunding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            category: "",
            location: "",
            date_finished: "",
            mygrant_target: ""
        };
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
                title: this.state.title,
                description: this.state.description,
                category: this.state.category,
                location: this.state.location,
                date_finished: this.state.date_finished,
                mygrant_target: this.state.mygrant_target,
                creator_id: this.state.creator_id
            })
        })
    }

    render() {
        const {
            title,
            description,
            category,
            location,
            date_finished,
            mygrant_target
        } = this.state;

        return (
            <Container className="main-container">
                <div>
                    <Header as="h1">Create a Crowdfunding</Header>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Input
                            placeholder="Title"
                            name="title"
                            value={title}
                            onChange={this.handleChange}
                            required
                        />
                        <Form.Input
                            placeholder="Description"
                            name="description"
                            value={description}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            placeholder="Category"
                            name="category"
                            value={category}
                            onChange={this.handleChange}
                            required
                        />
                        <Form.Input
                            placeholder="Location"
                            name="location"
                            value={location}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            placeholder="Finish Date"
                            name="date_finished"
                            value={date_finished}
                            type="date"
                            onChange={this.handleChange}
                            required
                        />
                        <Form.Input
                            placeholder="MyGrant Target"
                            name="mygrant_target"
                            value={mygrant_target}
                            onChange={this.handleChange}
                            required
                        />
                        <Form.Button content="Submit" />
                    </Form>
                </div>
            </Container>
        );
    }
}

export default withCookies(CreateCrowdfunding);
