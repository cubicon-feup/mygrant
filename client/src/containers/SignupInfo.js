import React, { Component } from 'react';
import fetchJsonp from 'fetch-jsonp';
import { instanceOf } from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withCookies, Cookies } from 'react-cookie';

import { Button, Container, Form, Header, Message, Modal, Responsive } from 'semantic-ui-react';
import { MygrantDivider } from '../components/Common';
import PidgeonMaps from '../components/Map';
import SearchLocation from '../components/SearchLocation';

import '../css/SignupInfo.css';


class SignUpInfo extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        history: ReactRouterPropTypes.history.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            cities: [],
            codes: [],
            countries: [],
            countryCode: '',
            formError: false,
            regions: [],
            requestCities: true,
            selectedCity: '',
            selectedCountry: '',
            selectedRegion: '',
            latitude: '',
            longitude: ''
        };
    }

    componentDidMount() {
        const { cookies } = this.props;
        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };

        // Get countries from the database
        fetch('/api/countries/as_options', { headers })
            .then(res => res.json())
            .then(countryList => {

                const countryCodes = [];

                countryList.forEach(country => {
                    countryCodes[country.value] = {};
                    countryCodes[country.value].key = country.code;
                    countryCodes[country.value].value = country.text;
                    countryCodes[country.value].text = country.text;
                }
                );

                this.setState({
                    cities: this.state.cities,
                    codes: countryCodes,
                    countries: countryList
                });
            });
    }

    getRegions(event, data) {
        const countryCode = this.state.codes[data.value].key;

        this.setState({
            cities: [],
            countryCode,
            formError: false,
            regions: [],
            requestCities: true,
            selectedCountry: data.value
        });

        // Get regions from the country using Batutta's JSONP API
        // API by medunes -  https://battuta.medunes.net
        // TODO: Create a mygrant account
        fetchJsonp(`https://battuta.medunes.net/api/region/${countryCode}/all/?key=bf7d51e0fe349bcc96b9233057599869&callback=`)
            .then(res => res.json())
            .then(regionsList => {

                // If the selected country has no regions (e.g. Kosovo), set the regions as the country itself
                if (regionsList.length === 0) {
                    this.setState({
                        cities: [this.state.codes[data.value]],
                        regions: [this.state.codes[data.value]],
                        requestCities: false
                    });
                } else {

                    const regionsArray = [];

                    // Create an options array from the information fetched
                    regionsList.forEach(item => {
                        regionsArray.push({
                            text: item.region,
                            value: item.region
                        });
                    });

                    // Sort alphabetically
                    regionsArray.sort(function(item1, item2) {
                        if (item1.text > item2.text) {
                            return 1;
                        } else if (item2.text > item1.text) {
                            return -1;
                        }

                        return 0;
                    });

                    this.setState({ regions: regionsArray });
                }
            });
    }

    getCities(event, data) {
        // Avoid bad requests when region was manually set (see getRegions)
        if (!this.state.requestCities) {
            this.setState({ selectedRegion: data.options[0].text });

            return;
        }

        const region = data.value;

        this.setState({
            cities: [],
            formError: false,
            selectedRegion: region
        });

        // Get cities from the region using Batutta's JSONP API
        // API by medunes -  https://battuta.medunes.net
        // TODO: Create a mygrant account
        fetchJsonp(
            `https://battuta.medunes.net/api/city/${this.state.countryCode}/search/?region=${region}&key=bf7d51e0fe349bcc96b9233057599869&callback=`
        ).then(res => res.json())
            .then(citiesList => {

                if (citiesList.length === 0) {
                    this.setState({
                        cities: [
                            {
                                key: data.value,
                                text: data.value,
                                value: data.value
                            }
                        ]
                    });
                } else {
                    const citiesArray = [];

                    // Create an options array from the information fetched
                    citiesList.forEach(item => {
                        citiesArray.push({
                            text: item.city,
                            value: item.city
                        });
                    });

                    // Sort alphabetically
                    citiesArray.sort(function(item1, item2) {
                        if (item1.text > item2.text) {
                            return 1;
                        } else if (item2.text > item1.text) {
                            return -1;
                        }

                        return 0;
                    });

                    this.setState({ cities: citiesArray });
                }
            });
    }

    setCity(event, data) {
        this.setState({ selectedCity: data.value });
    }

    // Submit the form, altering the user's fields regarding their location
    submitForm(event) {
        event.preventDefault();

        const { cookies } = this.props;

        const headers = {
            Authorization: `Bearer ${cookies.get('id_token')}`,
            'content-type': 'application/json'
        };

        const data = {
            city: this.state.selectedCity,
            country: this.state.selectedCountry,
            region: this.state.selectedRegion,
            latitude: this.state.latitude,
            longitude: this.state.longitude
        };

        fetch(
            '/api/users/set_location', {
                body: JSON.stringify(data),
                headers,
                method: 'POST'
            })
            .then(res => {
                if (res.status === 200) {
                    // Everything went well, go to root
                    this.props.history.push('/');
                } else {
                    // Should not happen, display an error
                    this.setState({ formError: true });
                }
            });
    }

    handleLocationChange = data => {
        this.setState({
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
            <div>
                <Responsive as={'div'} maxWidth={768} >
                    <Container fluid className="signupinfo-title-container" >
                        <Header as={'h1'}>{'tell us more'.toLowerCase()}<br/>{'about yourself'.toLowerCase()}</Header>
                    </Container>
                </Responsive>
                <Responsive as={MygrantDivider} maxWidth={768} color="green" />
                <Container className="main-container signupinfo">
                    <div>
                        <Form error={this.state.formError} onSubmit={this.submitForm.bind(this)}>
                            <Form.Select
                                search
                                onChange={this.getRegions.bind(this)}
                                label={'country'.toUpperCase()}
                                placeholder={'Country'}
                                options={this.state.countries}
                            />
                            <Form.Select
                                search
                                onChange={this.getCities.bind(this)}
                                label={'region'.toUpperCase()}
                                placeholder={'Region'}
                                options={this.state.regions}
                            />
                            <Form.Select
                                search
                                onChange={this.setCity.bind(this)}
                                label={'city'.toUpperCase()}
                                placeholder={'City'}
                                options={this.state.cities}
                            />
                            <SearchLocation handleChange={this.handleLocationChange} />
                            {this.renderMap()}
                            <Message
                                error
                                content={'something went wrong, please try again'}
                            />
                            <Button fluid circular className="mygrant-button" content={'Continue'.toUpperCase()}></Button>
                        </Form>
                    </div>
                </Container>
            </div>
        );
    }
}

export default withCookies(SignUpInfo);
