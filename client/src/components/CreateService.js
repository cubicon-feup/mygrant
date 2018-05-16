import React, { Component } from 'react';
import '../css/Service.css';
import { Container, Header, Icon, Form, Select } from 'semantic-ui-react';

const urlForData = 'http://localhost:3001/api/services';

const radiusoptions = [
    {
        key: '1',
        text: '10km',
        value: 10
    },
    {
        key: '2',
        text: '25km',
        value: 25
    },
    {
        key: '3',
        text: '50km',
        value: 50
    }
];

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
        this.setState({ touched: true });
    };

    handleChange = (e, { name, value }) => {
        this.setState(
            { error: this.invalidInput(this.props.value) },
            this.props.onChange(e, {
                name,
                value
            })
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
            service_categories: [],
            title: '',
            description: '',
            category: '',
            location: '',
            acceptable_radius: '',
            mygrant_value: '',
            creator_id: 1
        };
        this.service_categories = [];
    }

    componentDidMount() {
        this.setState({ service_type: this.props.match.params.type });

        fetch('/api/service_categories')
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    result.forEach(category => {
                        this.setState({
                            service_categories: [
                                ...this.state.service_categories,
                                {
                                    text: category.service_category,
                                    value: category.service_category
                                }
                            ]
                        });
                    });
                },
                () => {
                    console.log('ERROR', 'Failed to fetch service categories.');
                }
            );
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    handleNumberChange = (e, { name, value }) => {
        var newValue = parseInt(value, 10);
        this.setState({ [name]: newValue });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.setState({
            acceptable_radius: parseInt(this.state.acceptable_radius, 10),
            mygrant_value: parseInt(this.state.mygrant_value, 10),
            creator_id: parseInt(this.state.creator_id, 10)
        });

        console.log(JSON.stringify(this.state));

        fetch(urlForData, {
            method: 'PUT',
            body: JSON.stringify(this.state),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(result => {
                result.json();
                console.log(result);
            })
            .then(result =>
                this.setState({
                    title: '',
                    description: '',
                    category: '',
                    location: '',
                    acceptable_radius: 0,
                    mygrant_value: 0
                })
            );
    };

    createHeader() {
        if (this.state.service_type === 'PROVIDE') {
            return 'Provide Service';
        } else if (this.state.service_type === 'REQUEST') {
            return 'Request Service';
        }

        return 'ERROR';
    }

    render() {
        return (
            <Container className="main-container">
                <Header size="huge" textAlign="center">
                    <Icon name="external" />
                    {this.createHeader()}
                </Header>
                <Form
                    className="mygrant-createform"
                    method="POST"
                    onSubmit={this.handleSubmit}
                >
                    <TextInput
                        placeholder="Title"
                        value={this.state.title}
                        onChange={this.handleChange}
                    />
                    <TextInput
                        placeholder="Description"
                        value={this.state.description}
                        onChange={this.handleChange}
                    />
                    <Form.Dropdown
                        placeholder="Category"
                        name="category"
                        fluid
                        search
                        selection
                        options={this.state.service_categories}
                        onChange={this.handleChange}
                    />
                    <TextInput
                        placeholder="Location"
                        value={this.state.location}
                        onChange={this.handleChange}
                    />
                    <Form.Field
                        placeholder="Acceptable Radius"
                        name="acceptable_radius"
                        control={Select}
                        options={radiusoptions}
                        onChange={this.handleNumberChange}
                    />
                    <Form.Input
                        placeholder="MyGrant Value"
                        name="mygrant_value"
                        value={this.state.mygrant_value}
                        type="number"
                        onChange={this.handleNumberChange}
                        required
                    />
                    <Form.Button id="dark-button" content="Submit" />
                </Form>
            </Container>
        );
    }
}

export default CreateService;
