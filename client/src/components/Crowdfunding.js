import React, { Component } from 'react';
//import '../css/common.css';
import '../css/Crowdfunding.css';

import { Container, Header, Grid, Button, Label, Input,Comment, Rating, Loader, Image,Progress, Responsive, Form} from 'semantic-ui-react';
import { MygrantDividerLeft, MygrantDividerRight } from './Common';

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
        <Container className="main-container" fluid={true}>
            <Container textAlign="center">
              <Header as="h1" id="crowdfunding_mission">Mission</Header>
            </Container>
            <Container>
                <p><strong>{this.state.crowdfunding.title}</strong> <i id="crowdfunding_dot_divider">.</i> <text>{this.state.crowdfunding.category}</text></p>
            </Container>
              <Responsive as={MygrantDividerLeft} minWidth={768} className="intro-divider" color="purple" />
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
              <Container>
                  <Grid stackable columns={2} className="crowdfunding_grid">
                      <Grid.Column width={6} className="left_col">
                          <Image src='/assets/images/wireframe/image.png' />
                          <div id="crowdfunding_progress">
                              <h5>Progress</h5>
                              <Progress progress='percentage' value={20} total={this.state.crowdfunding.mygrant_target} size="small" color='green' active={true}/>
                              <p id="crowdfunding_earned">Earned : {20}
                                <div id="crowdfunding_target">Target : {this.state.crowdfunding.mygrant_target}</div>
                              </p>
                          </div>
                      </Grid.Column>
                      <Grid.Column width={10} className="right_col">
                          <h3>Description</h3>
                          <p id="description">{this.state.crowdfunding.description}</p>
                          <p><strong>Location: </strong>{this.state.crowdfunding.location}</p>
                          <Grid columns={2}>
                              <Grid.Column width={8}>
                                  <Grid stackable columns={2} className="crowdfunding_owner">
                                      <Grid.Column width={6}>
                                          <p>Image</p>
                                      </Grid.Column>
                                      <Grid.Column width={10}>
                                          {this.state.crowdfunding.creator_name}
                                          <div id="rating">
                                              <Rating disabled icon='star' defaultRating={this.state.rating.average_rating} maxRating={5} />
                                          </div>
                                      </Grid.Column>
                                  </Grid>
                              </Grid.Column>
                              <Grid.Column width={8} align="right">
                                  <h5>Ends In</h5>
                                  <p>{new Date(this.state.crowdfunding.date_finished).toLocaleDateString()}</p>
                              </Grid.Column>
                          </Grid>

                          <Form id="crowdfunding_donate" method="POST" onSubmit={this.handleSubmit}>
                              <Form.Group widths={16}>
                                  <Form.Input width={14} type='number' placeholder='Amount' name="amount" value={this.state.amount} onChange={this.handleChange}/>
                                  <Form.Button width={2} content="donate"/>
                              </Form.Group>
                          </Form>

                      </Grid.Column>
                  </Grid>
              </Container>
            <Responsive as={MygrantDividerRight} minWidth={768} className="intro-divider" color="green" />
            <Container id="services_donators">
                <Grid stackable divided columns={2}>
                    <Grid.Column width={10}>
                        <h4 align="center">Services</h4>

                    </Grid.Column>
                    <Grid.Column width={6}>
                        <h4 align="center">Donators</h4>
                    </Grid.Column>
                </Grid>
            </Container>
            <Container>
                <h3>Comments</h3>
            </Container>
            <Responsive as={MygrantDividerLeft} minWidth={768} className="intro-divider" color="purple" />
            <Container id="crowdfunding_comments">
                <Comment.Group>
                    <Comment>
                        <Comment.Avatar src='/assets/images/avatar/small/matt.jpg' />
                        <Comment.Content>
                            <Comment.Author as='a'>Matt</Comment.Author>
                            <Comment.Metadata>
                                <div>Today at 5:42PM</div>
                            </Comment.Metadata>
                            <Comment.Text>How artistic!</Comment.Text>
                            <Comment.Actions>
                                <Comment.Action>Reply</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                    </Comment>

                    <Comment>
                        <Comment.Avatar src='/assets/images/avatar/small/elliot.jpg' />
                        <Comment.Content>
                            <Comment.Author as='a'>Elliot Fu</Comment.Author>
                            <Comment.Metadata>
                                <div>Yesterday at 12:30AM</div>
                            </Comment.Metadata>
                            <Comment.Text>
                                <p>This has been very useful for my research. Thanks as well!</p>
                            </Comment.Text>
                            <Comment.Actions>
                                <Comment.Action>Reply</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                        <Comment.Group>
                            <Comment>
                                <Comment.Avatar src='/assets/images/avatar/small/jenny.jpg' />
                                <Comment.Content>
                                    <Comment.Author as='a'>Jenny Hess</Comment.Author>
                                    <Comment.Metadata>
                                        <div>Just now</div>
                                    </Comment.Metadata>
                                    <Comment.Text>
                                        Elliot you are always so right :)
                                    </Comment.Text>
                                    <Comment.Actions>
                                        <Comment.Action>Reply</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                            </Comment>
                        </Comment.Group>
                    </Comment>

                    <Comment>
                        <Comment.Avatar src='/assets/images/avatar/small/joe.jpg' />
                        <Comment.Content>
                            <Comment.Author as='a'>Joe Henderson</Comment.Author>
                            <Comment.Metadata>
                                <div>5 days ago</div>
                            </Comment.Metadata>
                            <Comment.Text>
                                Dude, this is awesome. Thanks so much
                            </Comment.Text>
                            <Comment.Actions>
                                <Comment.Action>Reply</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                    </Comment>

                    <Form reply>
                        <Form.TextArea />
                        <Button content='Comment' labelPosition='left' icon='edit' primary />
                    </Form>
                </Comment.Group>
            </Container>
          </Container>
      );
  }
}

export default Crowdfunding;
