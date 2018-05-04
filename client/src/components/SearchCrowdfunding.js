import React, { Component } from 'react';
import '../css/common.css';
import { Link } from 'react-router-dom';
import { Container, Header, Loader, Item, Button, Form, Pagination, Icon, Radio} from 'semantic-ui-react';

const urlForCrowdfundings = 'http://localhost:3001/api/crowdfundings/filter/';
const urlForData = id => `http://localhost:3001/api/crowdfundings/${id}`;
const urlForCategories = 'http://localhost:3001/api/service_categories';

const panels = [
    {
        title: 'Optional Details',
        content: {
            as: Form.Input,
            key: 'content',
            label: 'Maiden Name',
            placeholder: 'Maiden Name',
        },
    },
]

class SearchCrowdfunding extends Component {

    componentDidMount() {
        fetch(urlForCrowdfundings + '1-10')
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
        //this.setState({ amount: "" });
        var url = urlForCrowdfundings + '1-10?';
        if(this.state.order){
            url += '&sorting_method=' + this.state.order;
        }
        if(this.state.category){
            url += '&category=' + this.state.category;
        }
        if(this.state.location){
            url += '&location=' + this.state.location;
        }
        if(this.state.status){
            //url += '&status=' + this.state.status;
        }
        if(this.state.search_text){
            url += '&keywords=' + this.state.search_text;
        }
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            /*body: JSON.stringify({
                sorting_method:this.state.order,
                category: this.state.category,
                location: this.state.location,
                status: this.state.status,
                keywords: this.state.search_text
            })*/
        }).then(response => {
            if (!response.ok) {
                throw Error('Network request failed');
            }
            return response;
        })
        .then(result => result.json())
        .then(result => {
            this.setState({ crowdfundings: result });
            console.log(this.state.crowdfundings);
        }, () => {
            // "catch" the error
            this.setState({ requestFailed: true });
        });
        console.log(this.state.category);
        console.log(this.state.distance);
        console.log(this.state.location);
        console.log(this.state.order);
        console.log(this.state.search_text);
    }

    handlePageChange = (event, object) => {
        var url = urlForCrowdfundings + (1+(object.activePage-1)*10) + '-' + (10+(object.activePage-1)*10) + '?';
        if(this.state.order){
            url += '&sorting_method=' + this.state.order;
        }
        if(this.state.category){
            url += '&category=' + this.state.category;
        }
        if(this.state.location){
            url += '&location=' + this.state.location;
        }
        if(this.state.status){
            //url += '&status=' + this.state.status;
        }
        if(this.state.search_text){
            url += '&keywords=' + this.state.search_text;
        }
        fetch(url)
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
        this.table_body = {};
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
            this.table_body = this.state.crowdfundings.map(table_row => {
                return (
                    <Item>
                        <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                        <Item.Content verticalAlign='middle'>
                            <Item.Header>{table_row.title}</Item.Header>
                            <Item.Meta><a>{table_row.category}</a> <a>{table_row.creator_name}</a></Item.Meta>
                            <Item.Description>{table_row.status}</Item.Description>
                            <Item.Extra>
                                <Link to={"/crowdfunding/" + table_row.id}><Button  floated="right">See Details</Button></Link>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                );
            });
            this.categorie_body = this.state.categories.map(categorie => {
                return (
                    <Form.Field control={Radio} name="category" label={categorie.service_category} value={categorie.service_category} checked={this.state.category === categorie.service_category} onChange={this.handleChange} />
                );
            });
        }
        return (
            <Container className="main-container">
                <Form method="POST" onSubmit={this.handleSubmit}>
                    <Form.Input type='text' placeholder='Search' name="search_text" value={this.state.search} onChange={this.handleChange}/>
                    <h2>Filter</h2>
                    <Form.Group inline>
                        <label>Categorias</label>
                        {this.categorie_body}
                    </Form.Group>
                        <Form.Group inline>
                        <label>Distancia</label>
                        <Form.Radio label='Até 1 km' name="distance" value='1' checked={this.state.filter === '1'} onChange={this.handleChange} />
                        <Form.Radio label='Até 5 km' name="distance" value='5' checked={this.state.filter === '5'} onChange={this.handleChange} />
                        <Form.Radio label='Até 10 km' name="distance" value='10' checked={this.state.filter === '10'} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Group inline>
                        <label>Localidade</label>
                        <Form.Radio label='Small' name="location" value='sm' checked={this.state.filter === 'sm'} onChange={this.handleChange} />
                        <Form.Radio label='Medium' name="location" value='' checked={this.state.filter === 'md'} onChange={this.handleChange} />
                        <Form.Radio label='Large' name="location" value='lg' checked={this.state.filter === 'lg'} onChange={this.handleChange} />
                    </Form.Group>
                    <h2>Order by</h2>
                    <Form.Group inline>
                        <Form.Radio label='Beginning date' name="order" value='date_created' checked={this.state.order === 'date_created'} onChange={this.handleChange} />
                        <Form.Radio label='End date' name="order" value='date_finished' checked={this.state.order === 'date_finished'} onChange={this.handleChange} />
                        <Form.Radio label='Mygrant target' name="order" value='mygrant_target' checked={this.state.order === 'mygrant_target'} onChange={this.handleChange} />
                        <Form.Radio label='Rating' name="order" value='lg' checked={this.state.order === 'lg'} onChange={this.handleChange} />
                        <Form.Radio label='Name' name="order" value='title' checked={this.state.order === 'title'} onChange={this.handleChange} selected="selected" />
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

export default SearchCrowdfunding;
