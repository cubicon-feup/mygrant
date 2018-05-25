import React, { Component } from 'react';
import '../css/common.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { Container, Header, Loader, Item, Divider, Form, Pagination, Icon, Radio} from 'semantic-ui-react';
import ReactRouterPropTypes from 'react-router-prop-types';
import ListCrowdfunding from './ListCrowdfunding';

const urlForCrowdfundings = 'http://localhost:3001/api/crowdfundings/?items=10';
const urlForCategories = 'http://localhost:3001/api/service_categories';
const urlForTotalPages = 'http://localhost:3001/api/crowdfundings/search-count/?items=10';

class SearchCrowdfunding extends Component{
    static propTypes = {
        cookies: instanceOf(Cookies),
        location: ReactRouterPropTypes.location
    };

    getTotalPages() {
        const { cookies } = this.props;
        var url = urlForTotalPages;
        if(this.state) {
            if (this.state.search_text && this.state.search_text != "") {
                url += '&q=' + this.state.search_text;
            }
            if (this.state.category) {
                url += '&cat=' + this.state.category;
            }
            if (this.state.type && this.state.type != "both") {
                url += '&type=' + this.state.type;
            }
            if (this.state.mygmin) {
                url += '&mygmin=' + this.state.mygmin;
            }
            if (this.state.mygmin) {
                url += '&mygmax=' + this.state.mygmax;
            }
            if (this.state.datemin) {
                url += '&datemin=' + this.state.datemin;
            }
            if (this.state.datemax) {
                url += '&datemax=' + this.state.datemax;
            }
            if (this.state.order) {
                url += '&order=' + this.state.order;
            }
        }
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }
                return response;
            })
            .then(result => result.json())
            .then(result => {
                this.setState({ total_pages : result.pages });
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
    }

    componentDidMount() {
        const { cookies } = this.props;
        fetch(urlForCrowdfundings, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                console.log(result);
                this.setState({ crowdfundings: result });
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
        fetch(urlForCategories)
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                this.setState({ categories: result });
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleSubmit = (event) => {
        const { cookies } = this.props;
        var url = urlForCrowdfundings;
        if(this.state) {
            if (this.state.search_text && this.state.search_text != "") {
                url += '&q=' + this.state.search_text;
            }
            if (this.state.category) {
                url += '&cat=' + this.state.category;
            }
            if (this.state.type && this.state.type != "both") {
                url += '&type=' + this.state.type;
            }
            if (this.state.mygmin) {
                url += '&mygmin=' + this.state.mygmin;
            }
            if (this.state.mygmin) {
                url += '&mygmax=' + this.state.mygmax;
            }
            if (this.state.datemin) {
                url += '&datemin=' + this.state.datemin;
            }
            if (this.state.datemax) {
                url += '&datemax=' + this.state.datemax;
            }
            if (this.state.order) {
                url += '&order=' + this.state.order;
            }
        }
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw Error('Network request failed');
            }
            return response;
        })
        .then(result => result.json())
        .then(result => {
            this.setState({ crowdfundings: result });
        }, () => {
            // "catch" the error
            this.setState({ requestFailed: true });
        });
        this.paginationState = this.state;
    }

    handlePageChange = (event, object) => {
        const { cookies } = this.props;
        var url = urlForCrowdfundings + "&page=" + object.activePage;
        if(this.paginationState.search_text && this.paginationState.search_text != ""){
            url += '&q=' + this.paginationState.search_text;
        }
        if(this.paginationState.category){
            url += '&cat=' + this.paginationState.category;
        }
        if(this.paginationState.type && this.paginationState.type != "both"){
            url += '&type=' + this.paginationState.type;
        }
        if(this.paginationState.mygmin){
            url += '&mygmin=' + this.paginationState.mygmin;
        }
        if(this.paginationState.mygmin){
            url += '&mygmax=' + this.paginationState.mygmax;
        }
        if(this.paginationState.datemin){
            url += '&datemin=' + this.paginationState.datemin;
        }
        if(this.paginationState.datemax){
            url += '&datemax=' + this.paginationState.datemax;
        }
        if(this.paginationState.order){
            url += '&order=' + this.paginationState.order;
        }
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${cookies.get('id_token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                this.setState({ crowdfundings: result });
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
    }

    constructor(props) {
        super(props);
        this.page = 1; // from -> 1 + (this.page-1)*10 || to -> 10 + (this.page-1)*10
        this.state = {};
        this.paginationState = {};
        this.table_body = {};
        this.categories = [];
        this.setState({category:""});
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    render() {
        const { activeIndex } = this.state
        if(!this.state.crowdfundings || !this.state.categories){
            return (
                <Container className="main-container">
                    <div>
                        <Loader active inline='centered' />
                    </div>
                </Container>
            );
        }else{
            this.table_body = this.state.crowdfundings.map((table_row, index, array) => {
                if(index != 0){
                    return (
                        <div>
                            <Divider />
                        <ListCrowdfunding crowdfunding={table_row}/>
                        </div>
                    );
                }
                return (
                    <ListCrowdfunding crowdfunding={table_row}/>
                );
            });
            this.state.categories.map(categorie => {
                this.categories.push({text: categorie.service_category, value: categorie.service_category});
            });
        }
        return (
            <Container className="individual-page-container">
                <Form method="POST" onSubmit={this.handleSubmit}>
                    <Form.Input type='text' placeholder='Search' name="search_text" value={this.state.search} onChange={this.handleChange}/>
                    <h2>Filter</h2>
                    <Form.Group inline>
                        <Form.Select placeholder="Categoria" name="category" onChange={this.handleChange} options={this.categories}/>
                        <Form.Select placeholder="Distancia" name="discance" onChange={this.handleChange} options={[
                            {text:'Até 1 km', value:'1'},
                            {text:'Até 3 km', value:'3'},
                            {text:'Até 5 km', value:'5'}
                        ]}/>
                    </Form.Group>
                    <h2>Order by</h2>
                    <Form.Group inline>
                        <Form.Select placeholder="Order" name="discance" onChange={this.handleChange} options={[
                            {text:'Beginning date', value:'date_created'},
                            {text:'End date', value:'date_finished'},
                            {text:'Mygrant target', value:'mygrant_target'},
                            {text:'Name', value:'title'},
                        ]}/>
                    </Form.Group>
                    <Form.Button content="search"/>
                </Form>
                <hr/>
                <div>
                    <Header as="h1">Crowdfundings</Header>
                    <Item.Group divided>
                        {this.table_body}
                    </Item.Group>
                    <Pagination
                        defaultActivePage={1}
                        ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                        firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                        lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                        prevItem={{ content: <Icon name='angle left' />, icon: true }}
                        nextItem={{ content: <Icon name='angle right' />, icon: true }}
                        onPageChange={this.handlePageChange}
                        totalPages={10}
                    />
                </div>
            </Container>
        );
    }
}

export default withCookies(SearchCrowdfunding);
