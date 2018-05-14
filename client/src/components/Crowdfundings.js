import React, { Component } from 'react';
import '../css/common.css';
import { Link } from 'react-router-dom';
import { Container, Header, Grid, Table, Loader, Item, Button} from 'semantic-ui-react';

const urlForCrowdfundings = 'http://localhost:3001/api/crowdfundings';

class Crowdfundings extends Component {

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
                console.log(result);
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
    }

    render() {
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
            });
        }
        return (
            <Container className="main-container">
                <div>
                    <Header as="h1">Crowdfundings</Header>
                    <Item.Group divided>
                        {this.table_body}
                    </Item.Group>
                </div>
            </Container>
        );
    }
}

export default Crowdfundings;
