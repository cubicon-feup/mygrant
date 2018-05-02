import React, { Component } from 'react';
import '../css/common.css';
import { Link } from 'react-router-dom';
import { Container, Button, Select} from 'semantic-ui-react';
import SearchCrowdfunding from "./SearchCrowdfunding";
import SearchService from "./SearchService";

class SearchPage extends Component {

    handleChange = (e, { name, value }) => this.setState({ [name]: value });


    constructor(props) {
        super(props);
        this.state = {search_type:'services'};
        this.handleChange.bind(this);
    }

    render() {
        if(this.state.search_type == 'services') {
            return (
                <Container className="main-container">
                    <Select name="search_type" options={[
                        {
                            text: 'Services',
                            value: 'services'
                        },
                        {
                            text: 'Crowdfundings',
                            value: 'crowdfundings'
                        }
                    ]} onChange={this.handleChange}/>
                    <SearchService/>
                </Container>
            );
        }else{
            return (
                <Container className="main-container">
                    <Select name="search_type" options={[
                        {
                            text: 'Services',
                            value: 'services'
                        },
                        {
                            text: 'Crowdfundings',
                            value: 'crowdfundings'
                        }
                    ]} onChange={this.handleChange}/>
                    <SearchCrowdfunding/>
                </Container>
            );
        }
    }
type}

export default SearchPage;
