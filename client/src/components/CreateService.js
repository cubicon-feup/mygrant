import React, { Component } from 'react';
import '../css/common.css';
import { Container, Header, Form, Select } from 'semantic-ui-react';

const radiusoptions = [
    {
        key: '1',
        text: '10km',
        value: '10'
    },
    {
        key: '2',
        text: '25km',
        value: '25'
    },
    {
        key: '3',
        text: '50km',
        value: '50'
    }
];

const service_types = ['PROVIDE', 'REQUEST'];

class TextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            touched: false,
            error: true
        };
    }

    /**
     * Checks if the user input is valid.
     */
    invalidInput(value) {
        const test = /[^\wÀ-û\s]/;
        return test.test(value) || value.length < 5;
    }

    shouldMarkError() {
        return this.state.error ? this.state.touched : false;
    }

    handleBlur = () => {
        this.setState({
            touched: true
        });
    };

    handleChange = (e, { name, value }) => {
        this.setState(
            {
                error: this.invalidInput(this.props.value)
            },
            this.props.onChange(e, { name, value })
        );
    };

    render() {
        const varName = this.props.placeholder.toLowerCase().replace(/ /g, '_');

        return (
            <Form.Input
                className={this.shouldMarkError() ? 'error' : ''}
                placeholder={this.props.placeholder}
                name={varName}
                value={this.props.value}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                required
            />
        );
    }
}

/**
 * Creates the form that allows the creation of a new Service.
 */
class CreateService extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            category: '',
            location: '',
            acceptable_radius: '',
            mygrant_value: '',
            service_type: '',
            creator_id: 'this.user'
        };
        this.required = ['title', 'category', 'mygrant_value', 'service_type'];
    }

    handleChange = (e, { name, value }) => {
        this.setState({
            [name]: value
        });
    };

    handleSubmit = e =>
        this.setState({
            email: '',
            name: '',
            title: '',
            category: '',
            location: '',
            acceptable_radius: '',
            mygrant_value: '',
            service_type: ''
        });

    render() {
        const { title, category, location, mygrant_value } = this.state;

        var radioServiceTypes = service_types.map(type => {
            return (
                <Form.Radio
                    label={type.charAt(0) + type.slice(1).toLowerCase()}
                    name="service_type"
                    value={type}
                    checked={this.state.service_type === type}
                    onChange={this.handleChange}
                />
            );
        });

        return (
            <Container className="main-container">
                <div>
                    <Header as="h1">Create a Service</Header>
                    <Form onSubmit={this.handleSubmit}>
                        <TextInput
                            placeholder="Title"
                            value={title}
                            onChange={this.handleChange}
                        />
                        <TextInput
                            placeholder="Category"
                            value={category}
                            onChange={this.handleChange}
                        />
                        <TextInput
                            placeholder="Location"
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
                        <TextInput
                            placeholder="MyGrant Value"
                            value={mygrant_value}
                            onChange={this.handleChange}
                        />
                        <Form.Group inline>{radioServiceTypes}</Form.Group>
                        <Form.Button content="Submit" />
                    </Form>
                </div>
            </Container>
        );
    }
}

export default CreateService;
