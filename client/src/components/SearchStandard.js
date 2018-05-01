import React, { Component } from 'react';
import '../css/common.css';
import { Link } from 'react-router-dom';
import { Container, Header, Loader, Item, Button, Input, Menu, Dropdown, Form, Accordion} from 'semantic-ui-react';

const urlForCrowdfundings = 'http://localhost:3001/api/crowdfundings';
const urlForData = id => `http://localhost:3001/api/crowdfundings/${id}`;

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

class SearchStandard extends Component {

    componentDidMount() {
        fetch(urlForCrowdfundings)
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

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleSubmit = (event) => {
        //this.setState({ amount: "" });
        alert(JSON.stringify({
            id:this.state.id,
            donator_id:this.state.donator_id,
            amount:this.state.amount
        }));
        fetch(urlForData(this.state.id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                donator_id:this.state.donator_id,
                amount:parseInt(this.state.amount)
            })
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
    }

    constructor(props) {
        super(props);
        this.list = [
            {
                'id': 0,
                'title': 'Project1',
                'description': 'hueee',
                'location': 'ali',
                'earned': '',
                'target': '',
                'end_date': ''
            },
            {
                'id': 1,
                'title': 'Project2',
                'description': '',
                'location': '',
                'earned': '',
                'target': '',
                'end_date': ''
            }
        ];
        this.state = {};
        this.table_body = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        const { activeIndex } = this.state
        if(!this.state.crowdfundings){
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
                /*<Table.Row>
                        <Table.Cell>{table_row.title}</Table.Cell>
                        <Table.Cell>{table_row.category}</Table.Cell>
                        <Table.Cell>{table_row.location}</Table.Cell>
                        <Table.Cell>{table_row.status}</Table.Cell>
                        <Table.Cell>{table_row.mygrant_target}</Table.Cell>
                        <Table.Cell>{table_row.creator_name}</Table.Cell>
                        <Table.Cell><Link to={"/crowdfunding/" + 2} >Link</Link></Table.Cell>
                    </Table.Row>*/
            });
        }
        return (
            <Container className="main-container">
                <Menu>
                    <Menu.Item>
                        <Input action={{ type: 'submit', content: 'Search' }} placeholder='Search' />
                    </Menu.Item>
                    <Menu.Item>
                        <Input placeholder='order dropdwon'/>
                    </Menu.Item>
                    <Menu.Item>
                        <Input placeholder='filter dropdwon'/>
                    </Menu.Item>
                </Menu>
                <Form method="POST" onSubmit={this.handleSubmit}>
                    <Form.Input labelPosition='right' type='text' placeholder='Amount' name="search_text" value={this.state.search} onChange={this.handleChange}/>
                    <Form.Group inline>
                        <label>Filtro</label>
                        <Form.Radio label='Small' value='sm' checked={value === 'sm'} onChange={this.handleChange} />
                        <Form.Radio label='Medium' value='md' checked={value === 'md'} onChange={this.handleChange} />
                        <Form.Radio label='Large' value='lg' checked={value === 'lg'} onChange={this.handleChange} />
                    </Form.Group>
                    <Form.Button content="search"/>
                </Form>
                <div>
                    <Header as="h1">Crowdfundings</Header>
                    <Item.Group divided>
                        {this.table_body}
                    </Item.Group>
                </div>
            </Container>
        );
        /*<Table selectable>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Title</Table.HeaderCell>
                                <Table.HeaderCell>Category</Table.HeaderCell>
                                <Table.HeaderCell>Location</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Target</Table.HeaderCell>
                                <Table.HeaderCell>Owner</Table.HeaderCell>
                                <Table.HeaderCell>Link</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.table_body}
                        </Table.Body>
                    </Table>*/
    }
}

export default SearchStandard;
