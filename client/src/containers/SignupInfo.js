import React, { Component } from 'react';
import fetchJsonp from 'fetch-jsonp';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Container, Form, Header } from 'semantic-ui-react';

import '../css/common.css';


class SignUpInfo extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);

        this.state = {
            cities: [],
            countries: [],
            countryCode: '',
            regions: []
        };
    }

    componentDidMount() {
        const { cookies } = this.props;
        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` }

        // Get countries from the database
        fetch('/api/countries/as_options', { headers })
            .then(res => res.json())
            .then(countryList => {
                this.setState({
                    cities: this.state.cities,
                    countries: countryList
                });
            });
    }

    getRegions(event, data) {
        const countryCode = this.state.countries[data.value - 1].code;
        this.setState({
            cities: [],
            countryCode,
            regions: []
        });

        // Get regions from the country using Batutta's JSONP API
        // API by medunes -  https://battuta.medunes.net
        // TODO: Create a mygrant account
        fetchJsonp(`https://battuta.medunes.net/api/region/${countryCode}/all/?key=bf7d51e0fe349bcc96b9233057599869&callback=`)
            .then(res => res.json())
            .then(regionsList => {
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
            });
    }

    getCities(event, data) {
        const region = data.value;
        this.setState({ cities: [] });

        // Get cities from the region using Batutta's JSONP API
        // API by medunes -  https://battuta.medunes.net
        // TODO: Create a mygrant account
        fetchJsonp(`https://battuta.medunes.net/api/city/${this.state.countryCode}/search/?region=
      ${region}&key=bf7d51e0fe349bcc96b9233057599869&callback=`)
            .then(res => res.json())
            .then(citiesList => {
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
            });
    }

    render() {
        return (
            <Container className="main-container">
                <div>
                    <Header as="h1">{'Tell us more about yourself'.toLowerCase()}</Header>
                    <Form>
                        <Form.Select onChange={this.getRegions.bind(this)} label={'Your Country'.toUpperCase()} placeholder={'Country'} options={this.state.countries}/>
                        <Form.Select onChange={this.getCities.bind(this)} label={'Your Region'.toUpperCase()} placeholder={'Region'} options={this.state.regions}/>
                        <Form.Select label={'Your City'.toUpperCase()} placeholder={'City'} options={this.state.cities}/>
                    </Form>
                </div>
            </Container>
        );
    }
}

export default withCookies(SignUpInfo);

