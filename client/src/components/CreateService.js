import React, { Component } from "react";
import "../css/common.css";
import { Container, Header, Form, Select } from "semantic-ui-react";

const radiusoptions = [
    {
        key: "1",
        text: "10km",
        value: "10"
    },
    {
        key: "2",
        text: "25km",
        value: "25"
    },
    {
        key: "3",
        text: "50km",
        value: "50"
    }
];

class CreateService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            category: "",
            location: "",
            acceptable_radius: "",
            mygrant_value: "",
            service_type: "PROVIDE",
            creator_id: "this.user"
        };
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleSubmit = () =>
        this.setState({
            email: "",
            name: "",
            title: "",
            category: "",
            location: "",
            acceptable_radius: "",
            mygrant_value: ""
        });

    render() {
        const {
            title,
            category,
            location,
            acceptable_radius,
            mygrant_value
        } = this.state;

        return (
            <Container className="main-container">
                <div>
                    <Header as="h1">Create a Service</Header>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Input
                            placeholder="Title"
                            name="title"
                            value={title}
                            onChange={this.handleChange}
                            required
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
                        <Form.Field
                            placeholder="Acceptable Radius"
                            name="acceptable_radius"
                            control={Select}
                            options={radiusoptions}
                            onChange={this.handleChange}
                        />
                        <Form.Input
                            placeholder="MyGrant Value"
                            name="mygrant_value"
                            value={mygrant_value}
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

export default CreateService;
