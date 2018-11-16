import React, { Component } from 'react';
import '../css/common.css';
import { Link } from 'react-router-dom';
import { Container, Header, Grid, Table, Segment, Card, Loader, Label, Item, Button, Icon} from 'semantic-ui-react';

const urlForPolls = 'http://localhost:3001/api/polls';
const urlForUser = id => `/api/users/${id}`;

class Polls extends Component {

    componentDidMount() {
        fetch(urlForPolls)
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                
                var creator_names = [];

                this.add_creator_names(result);
                
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });

    }
    

    constructor(props) {
        super(props);
        this.state = {};
        this.table_body = {};
    }

    add_creator_names = async (result) => {
        for (var i = 0; i < result.length; i++){
            
            await fetch(urlForUser(result[i]['id_creator']))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result2 => result2.json())
            .then(result2 => {
                //Object.assign(result[i],{'creator_name' : result2['full_name']});
                result[i]['creator_name'] = result2['full_name'];
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
        }


        this.setState({polls: result});
    }

    render() {
        if(!this.state.polls){
            return (
                <Container className="main-container">
                    <div>
                        <Loader active inline='centered' />
                    </div>
                </Container>
            );
        }else{
            this.table_body = this.state.polls.map((table_row,index) => {
                return (
                    <Card>
                            <Card.Content>
                            <Card.Header>{table_row.question}</Card.Header>
                            <Card.Meta>
                            <span>Created by <Link to={"/user/" + table_row.id_creator}>{table_row.creator_name}</Link></span>
                            </Card.Meta>
                            </Card.Content>
                            <Card.Content extra style={{textAlign: 'right'}}>
                                <Link to={"/poll/" + table_row.id}>Vote<Icon name='chevron right' /></Link>
                            </Card.Content>
                    </Card>


                );
            });
        }
        return (
            <Container className="main-container">
                <div>
                    <Header as="h1">Polls</Header>

                    <Card.Group divided>
                        {this.table_body}
                    </Card.Group>

                </div>
            </Container>
        );
    }
}

export default Polls;
