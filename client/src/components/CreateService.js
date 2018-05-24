import React, { Component } from 'react';
import '../css/Service.css';
import {
    Button,
    Container,
    Header,
    Icon,
    Form,
    Modal,
    Select
} from 'semantic-ui-react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import PidgeonMaps from './Map';
import SearchLocation from './SearchLocation';

const urlForData = '/api/services';
const urlForCategories = '/api/service_categories';

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
            latitude: '',
            longitude: '',
            acceptable_radius: 0,
            mygrant_value: 0,
            service_type: '',
            creator_id: 0,
            repeatable: false
        };
        this.service_categories = [];
    }

    componentDidMount() {
        const { cookies } = this.props;

        this.setState({
            creator_id: parseInt(cookies.get('user_id'), 10),
            service_type: this.props.match.params.type
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

    handleLocationChange = data => {
        this.setState({
            location: data.title,
            latitude: data.latitude,
            longitude: data.longitude
        });
    };

    handleMapChange = latlng => {
        this.setState({
            latitude: latlng[0],
            longitude: latlng[1]
        });
    };

    handleNumberChange = (e, { name, value }) => {
        var newValue = parseInt(value, 10);
        this.setState({ [name]: newValue });
    };

    handleSubmit = e => {
        const { cookies } = this.props;
        e.preventDefault();

        fetch(urlForData, {
            method: 'PUT',
            body: JSON.stringify(this.state),
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(result => result.json())
            .then(
                service => {
                    this.setState({
                        title: '',
                        description: '',
                        category: '',
                        location: '',
                        acceptable_radius: 0,
                        mygrant_value: 0,
                        repeatable: false
                    });
                    this.props.history.push(`/service/${service.id}`);
                },
                () => console.log('ERROR', 'Failed to create the service')
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

    renderMap() {
        return (
            <Modal trigger={<Button content={'Open Map'} />}>
                <Modal.Content>
                    <PidgeonMaps handleChange={this.handleMapChange} />
                </Modal.Content>
            </Modal>
        );
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
                    <Form.Field>
                        <SearchLocation handleChange={this.handleLocationChange} />
                    </Form.Field>
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
                    <Form.Checkbox
                        label="Repeatable"
                        name="repeatable"
                        onChange={this.handleBooleanChange}
                    />
                    {this.renderMap()}
                    <Form.Button id="dark-button" content="Submit" />
                </Form>
            </Container>
        );
    }
}

export default withCookies(CreateService);
