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
            creator_id: 'this.user',
            touched: {},
            errors: {}
        };
        this.required = ['title', 'category', 'mygrant_value', 'service_type'];
    }

    componentDidMount() {
        var initTouched = {};
        var initErrors = {};
        for (var name of this.required) {
            var t = { [name]: false };
            var e = { [name]: this.invalidInput(name) };
            initTouched = { ...initTouched, ...t };
            initErrors = { ...initErrors, ...e };
        }

        this.setState({
            touched: initTouched,
            errors: initErrors
        });
    }

    invalidInput(name) {
        return this.state[name].length < 3;
    }

    shouldMarkError(name) {
        return this.state.errors[name] ? this.state.touched[name] : false;
    }

    handleBlur = e => {
        this.setState({
            touched: { ...this.state.touched, [e.target.name]: true }
        });
    };

    handleChange = (e, { name, value }) => {
        this.setState({
            [name]: value,
            errors: {
                ...this.state.errors,
                [name]: this.invalidInput(name)
            }
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

        return (
            <Container className="main-container">
                <div>
                    <Header as="h1">Create a Service</Header>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Input
                            className={
                                this.shouldMarkError('title') ? 'error' : ''
                            }
                            placeholder="Title"
                            name="title"
                            value={title}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
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
                        <Form.Group inline>
                            <Form.Radio
                                label="Provide"
                                name="service_type"
                                value="PROVIDE"
                                checked={this.state.service_type === 'PROVIDE'}
                                onChange={this.handleChange}
                            />
                            <Form.Radio
                                label="Request"
                                name="service_type"
                                value="REQUEST"
                                checked={this.state.service_type === 'REQUEST'}
                                onChange={this.handleChange}
                            />
                        </Form.Group>
                        <Form.Button content="Submit" />
                    </Form>
                </div>
            </Container>
        );
    }
}

export default CreateService;
