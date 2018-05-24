import React, { Component } from 'react';
import '../css/Service.css';
import { Search } from 'semantic-ui-react';

const urlForLatLng = query =>
    `https://nominatim.openstreetmap.org/search/${query}?format=json&limit=3`;

class SearchLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            latitude: '',
            longitude: '',
            results: []
        };
    }

    handleChange = (e, data) => {
        this.setState(data.result);
        this.props.handleChange(data.result);
    };

    fetchLocation = (e, data) => {
        fetch(urlForLatLng(data.value))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.cleanLocations(result);
                },
                () => {
                    console.log('ERROR', 'Failed to fetch location.');
                }
            );
    };

    cleanLocations(locations) {
        var location_results = [];
        locations.forEach(location => {
            location_results = [
                ...location_results,
                {
                    title: location.display_name,
                    latitude: location.lat,
                    longitude: location.lon
                }
            ];
        });
        this.setState({ results: location_results });
    }

    render() {
        return (
            <Search
                fluid
                id="search-location"
                onResultSelect={this.handleChange}
                onSearchChange={this.fetchLocation}
                results={this.state.results}
            />
        );
    }
}

export default SearchLocation;
