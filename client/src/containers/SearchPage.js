import React, { Component } from 'react';
import '../css/Search.css';
import { Link } from 'react-router-dom';
import { Container, Select, Radio, Grid} from 'semantic-ui-react';
import SearchCrowdfunding from "../components/SearchCrowdfunding";
import SearchService from "../components/SearchService";

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
                    <Grid centered id="search_type_grid">
                        <Grid.Column width={8} className="centered aligned selected">
                            <Radio label="Services" value="services" name="search_type" checked onChange={this.handleChange}/>
                        </Grid.Column>
                        <Grid.Column width={8} className="centered aligned">
                            <Radio label="Missions" value="crowdfundings" name="search_type" onChange={this.handleChange}/>
                        </Grid.Column>
                    </Grid>
                    <SearchService/>
                </Container>
            );
        }else{
            return (
                <Container className="main-container">
                    <Grid centered id="search_type_grid">
                        <Grid.Column width={8} className="centered aligned">
                            <Radio label="Services" value="services" name="search_type" onChange={this.handleChange}/>
                        </Grid.Column>
                        <Grid.Column width={8} className="centered aligned selected">
                            <Radio label="Missions" value="crowdfundings" name="search_type" checked onChange={this.handleChange}/>
                        </Grid.Column>
                    </Grid>
                    <SearchCrowdfunding/>
                </Container>
            );
        }
    }
type}

export default SearchPage;
