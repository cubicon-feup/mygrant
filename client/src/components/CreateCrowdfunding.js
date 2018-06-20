import React, { Component } from "react";
import "../css/common.css";
import { Button, Container, Header, Form, Modal } from "semantic-ui-react";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ReactRouterPropTypes from 'react-router-prop-types';
import PidgeonMaps from './Map';
import SearchLocation from './SearchLocation';

const urlForCreate = '/api/crowdfundings';
const urlGetCategories = '/api/service_categories';
const crowdfundingCollectingWeeks = require('../config').crowdfundingCollectingWeeks;

class CreateCrowdfunding extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        history: ReactRouterPropTypes.history.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            title: "",
            description: "",
            category: "",
            location: "",
            latitude: "",
            longitude: "",
            mygrant_target: "",
            categories: []
        };
    }

    componentDidMount() {
        this.getCategories();
    }

    getCategories() {
        fetch(urlGetCategories, {
            method: 'GET'
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        let categories = [];
                        for(let i = 0; i < data.length; i++) {
                            let object = {
                                key: i,
                                text: data[i].service_category,
                                value: data[i].service_category
                            }
                            categories.push(object);
                        }
                        this.setState({categories: categories});
                    })
            }
        })
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

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
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                time_interval: crowdfundingCollectingWeeks,
                mygrant_target: this.state.mygrant_target,
            })
        }).then(res => {
            if(res.status === 201) {
                res.json()
                    .then(data => {
                        this.props.history.push(`/crowdfunding/${data.id}`);
                    })
            }
        })
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
        const {
            title,
            description,
            mygrant_target,
            categories
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
                        <Form.Dropdown
                            placeholder="Category"
                            name="category"
                            fluid
                            search
                            selection
                            options={categories}
                            onChange={this.handleChange}
                        />
                        <Form.Field>
                            <SearchLocation handleChange={this.handleLocationChange} />
                        </Form.Field>
                        <Form.Input
                            placeholder="MyGrant Target"
                            name="mygrant_target"
                            value={mygrant_target}
                            type="number"
                            onChange={this.handleChange}
                            required
                        />
                        {this.renderMap()}
                        <Form.Button content="Submit" />
                    </Form>
                </div>
            </Container>
        );
    }
}

export default withCookies(CreateCrowdfunding);
