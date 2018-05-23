import React, { Component } from 'react';
import Map from 'pigeon-maps';
import Marker from 'pigeon-marker/react';

const getProvider = (x, y, z) =>
    `https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/${z}/${x}/${y}.png`;

class PigeonMaps extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latlng: [
                41.178,
                -8.598
            ],
            zoom: 16
        };
    }

    handleClick = ({ event, latLng }) => {
        this.setState({ latlng: latLng });
        this.props.handleChange && this.props.handleChange(latLng);
    };

    render() {
        return (
            <Map
                width={900}
                height={600}
                defaultCenter={this.state.latlng}
                defaultZoom={this.state.zoom}
                provider={getProvider}
                onClick={this.handleClick}
            >
                <Marker anchor={this.state.latlng} />
            </Map>
        );
    }
}

export default PigeonMaps;
