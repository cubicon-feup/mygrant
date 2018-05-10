import React, { Component } from 'react';
import '../css/common.css';

import { Container, Header, Grid, Table, Button, Label, Input, Loader, Modal, Form} from 'semantic-ui-react';

const urlForData = id => `http://localhost:3001/api/crowdfundings/${id}`;
const urlForRating = id => `http://localhost:3001/api/crowdfundings/${id}/rating`;
const urlForDonations = id => `http://localhost:3001/api/crowdfundings/${id}/donations`;
const urlForServices = id => `http://localhost:3001/api/crowdfundings/${id}/services`;
const urlForDonate = id => `http://localhost:3001/api/crowdfundings/${id}/donations`;
// TODO create,update and delete
// TODO donate

class Crowdfunding extends Component {
  constructor(props) {
      super(props);
      this.state = { requestFailed: false,
          id: this.props.match.params.id,
          donator_id: 2
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

    componentDidMount() {
        //DATA REQUEST
        fetch(urlForData(this.props.match.params.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                console.log(result);
                this.setState({ crowdfunding: result });
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
        //RATING REQUEST
        fetch(urlForRating(this.props.match.params.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                console.log(result);
                this.setState({ rating: result });
                if(!this.state.rating.average_rating){
                    this.setState({ rating: { average_rating : "No rating"}});
                }
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
        //DONATIONS REQUEST - TODO Doesnt seem to work
        /*fetch(urlForDonations(this.props.match.params.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                console.log(result);
                this.setState({ donations: result });
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });*/
        //SERVICES REQUEST - TODO doesnt seem to work
        /*fetch(urlForServices(this.props.match.params.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                console.log(result);
                this.setState({ services: result });
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });*/
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleSubmit = (event) => {
        //this.setState({ amount: "" });
        alert(JSON.stringify({
            id:this.state.id,
            donator_id:this.state.donator_id,
            amount:this.state.amount
        }));
        fetch(urlForDonate(this.state.id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                donator_id:this.state.donator_id,
                amount:parseInt(this.state.amount)
            })
        })
    }
  render() {

      if(this.state.requestFailed) {
          return (
              <Container className="main-container">
                  <div>
                      <h1>Request Failed</h1>
                  </div>
              </Container>
          );
      }

      if(!this.state.crowdfunding || !this.state.rating || !this.state.rating.average_rating) {
          return (
              <Container className="main-container">
              <div>
              <Loader active inline='centered' />
              </div>
              </Container>
      );
      }

      return (
        <Container className="main-container">
          <div>
            <Header as="h1">Crowdfunding</Header>
              {/*<Table selectable>
                  <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Location</Table.HeaderCell>
                        <Table.HeaderCell>Earned</Table.HeaderCell>
                        <Table.HeaderCell>Target</Table.HeaderCell>
                        <Table.HeaderCell>Ends in</Table.HeaderCell>
                        <Table.HeaderCell>Options</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                      <Table.Row>
                          {this.state.crowdfunding &&
                          <Table.Cell>{this.state.crowdfunding.title}</Table.Cell>}
                          {this.state.crowdfunding &&
                          <Table.Cell>{this.state.crowdfunding.description}</Table.Cell>}
                          {this.state.crowdfunding &&
                          <Table.Cell>{this.state.crowdfunding.location}</Table.Cell>}
                          {this.state.crowdfunding &&
                          <Table.Cell>{this.state.crowdfunding.category}</Table.Cell>}
                          {this.state.crowdfunding &&
                          <Table.Cell>{this.state.crowdfunding.mygrant_target}</Table.Cell>}
                          {this.state.crowdfunding &&
                          <Table.Cell>{new Date(this.state.crowdfunding.date_finished).toLocaleDateString()}</Table.Cell>}
                          <Table.Cell>
                              <Button>
                                  <Button.Content>Donate</Button.Content>
                              </Button>
                          </Table.Cell>
                      </Table.Row>
                  </Table.Body>
              </Table>*/}
              <Grid stackable divided columns={2}>
                  <Grid.Column>
                      <strong>Title:</strong>
                      <h3>{this.state.crowdfunding.title}</h3>
                      <h4><strong>Category: </strong>{this.state.crowdfunding.category}</h4>
                      <p><strong>Description: </strong>{this.state.crowdfunding.description}</p>
                      <p><strong>Location: </strong>{this.state.crowdfunding.location}</p>
                      <p>
                          <strong>Creator:</strong>
                          <a>{this.state.crowdfunding.creator_name}</a>
                      </p>
                  </Grid.Column>
                  <Grid.Column>
                      <h5>Rating</h5>
                      <p>{this.state.rating.average_rating}</p>
                      <h5>Ends In</h5>
                      <p>{new Date(this.state.crowdfunding.date_finished).toLocaleDateString()}</p>
                      <h5>Target</h5>
                      <p>{this.state.crowdfunding.mygrant_target} MyGrants</p>
                      <Form method="POST" onSubmit={this.handleSubmit}>
                          <Form.Input labelPosition='right' type='number' placeholder='Amount' name="amount" value={this.state.amount} onChange={this.handleChange}/>
                          <Form.Button content="donate"/>
                      </Form>

                  </Grid.Column>
              </Grid>
          </div>
        </Container>
      );
  }
}

export default Crowdfunding;
