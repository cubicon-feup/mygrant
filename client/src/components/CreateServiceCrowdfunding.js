import React, { Component } from 'react';
import '../css/Service.css';
import { Container, Header, Icon, Form, Select } from 'semantic-ui-react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

const urlCreateService = crowdfundingId => '/api/crowdfundings/' + crowdfundingId + '/services_requested';
const urlForCategories = '/api/service_categories';

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
                required={varName === 'title'}
            />
        );
    }
}

/**
 * Creates the form that allows the creation of a new Service.
 */
class CreateService extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        location: ReactRouterPropTypes.location.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            category: '',
            location: '',
            mygrant_value: 0,
        };
        this.service_categories = [];
        this.crowdfundingId = this.props.match.params.crowdfunding_id;
    }

    componentDidMount() {
        const { cookies } = this.props;

        this.setState({
            creator_id: parseInt(cookies.get('user_id'), 10)
        });

        fetch(urlForCategories)
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
                        this.service_categories = [
                            ...this.service_categories,
                            {
                                text: category.service_category,
                                value: category.service_category
                            }
                        ];
                    });
                    this.forceUpdate();
                },
                () => {
                    console.log('ERROR', 'Failed to fetch service categories.');
                }
            );
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    handleBooleanChange = (e, { name, value }) => {
        this.setState({ [name]: !this.state[name] });
    };

    handleNumberChange = (e, { name, value }) => {
        var newValue = parseInt(value, 10);
        this.setState({ [name]: newValue });
    };

    handleSubmit = e => {
        const { cookies } = this.props;
        e.preventDefault();

        fetch(urlCreateService(this.crowdfundingId), {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(result => {
                result.json();
            })
            .then(result =>
                this.setState({
                    title: '',
                    description: '',
                    category: '',
                    location: '',
                    mygrant_value: 0,
                })
            );
            this.props.history.push(`/crowdfunding/${this.crowdfundingId}`);
    };

    createHeader() {
        return 'Request Service';
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
                        options={this.service_categories}
                        onChange={this.handleChange}
                    />
                    <TextInput
                        placeholder="Location"
                        value={this.state.location}
                        onChange={this.handleChange}
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

export default withCookies(CreateService);
