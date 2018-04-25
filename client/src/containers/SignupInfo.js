import React, { Component } from 'react';
import '../css/common.css';
import fetchJsonp from 'fetch-jsonp';

import { Container, Form, Header } from 'semantic-ui-react';

class SignUpInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { regions: [], countries: [], countryCode: '',cities: [] };
  }

  componentDidMount() {
      fetch('/api/countries/as_options')
        .then(res => res.json())
          .then(data => {
              this.setState({ cities: this.state.cities, countries: data });
          });
  }

  /*
   * Make a request to Battuta to get the regions from the selected country
   */
  getRegions(e, data) {
      const countryCode =  this.state.countries[data.value-1].code;
      this.setState({countryCode: countryCode});
      
      // Get regions from the country using Batutta's JSONP API
      // API by medunes -  https://battuta.medunes.net
      // TODO: Create a mygrant account
      fetchJsonp('https://battuta.medunes.net/api/region/'+ countryCode + '/all/?key=bf7d51e0fe349bcc96b9233057599869&callback=')
          .then(res => res.json())
          .then(data => {
              let regionsArray = []

              // Create an options array from the information fetched
              data.forEach(item => {
                  regionsArray.push({ text: item.region, value: item.region });
              });

              // Sort alphabetically
              regionsArray.sort(function(a,b) {return (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0);} ); 

              this.setState({ regions: regionsArray });  
          });
  }

  /*
   * Make a request to Battuta to get the cities from the selected region
   */
  getCities(e, data) {
      const region =  data.value;
      
      // Get regions from the country using Batutta's JSONP API
      // API by medunes -  https://battuta.medunes.net
      // TODO: Create a mygrant account
      fetchJsonp('https://battuta.medunes.net/api/city/'+ this.state.countryCode + '/search/?region='
      + region + '&key=bf7d51e0fe349bcc96b9233057599869&callback=')
          .then(res => res.json())
          .then(data => {
              let citiesArray = []

              // Create an options array from the information fetched
              data.forEach(item => {
                  citiesArray.push({ text: item.city, value: item.city });
              });

              // Sort alphabetically
              citiesArray.sort(function(a,b) {return (a.text > b.text) ? 1 : ((b.text > a.text) ? -1 : 0);} ); 

              this.setState({ cities: citiesArray });  
          });
  }

  render() {
    return (
      <Container className="main-container">
        <div>
          <Header as="h1">{"Tell us more about yourself".toLowerCase()}</Header>
          <Form>
            <Form.Input label={"Your Name".toUpperCase()} type="text" placeholder="Name"/>
            <Form.Input label={"Your phone number".toUpperCase()} type="text" placeholder="Phone Number"/>
            <Form.Select onChange={this.getRegions.bind(this)} label={"Your Country".toUpperCase()} placeholder={"Country"} options={this.state.countries}/>
            <Form.Select onChange={this.getCities.bind(this)} label={"Your Region".toUpperCase()} placeholder="Region" options={this.state.regions}/>
            <Form.Select label={"Your City".toUpperCase()} placeholder="City" options={this.state.cities}/>
          </Form>
        </div>
      </Container>
    );
  }
}

export default SignUpInfo;

