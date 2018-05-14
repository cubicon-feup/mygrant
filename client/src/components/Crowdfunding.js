import React, { Component } from 'react';
//import '../css/common.css';
import '../css/Crowdfunding.css';

import { Container, Header, Grid, Button, Label, Icon, Item, Input,Comment, Rating, Loader, Image,Progress, Responsive, Form} from 'semantic-ui-react';
import { MygrantDividerLeft, MygrantDividerRight } from './Common';

import CommentComp from './Comment';

const apiPath = require('../config').apiPath;
const urlForData = crowdfundingId => `http://localhost:3001/api/crowdfundings/` + crowdfundingId;
const urlForRating = crowdfundingId => `http://localhost:3001/api/crowdfundings/` + crowdfundingId + `/rating`;
const urlForDonations = crowdfundingId => `http://localhost:3001/api/crowdfundings/` + crowdfundingId  + `/donations`;
const urlForServices = crowdfundingId => `http://localhost:3001/api/crowdfundings/` + crowdfundingId + `/services`;
const urlForDonate = crowdfundingId => `http://localhost:3001/api/crowdfundings/` + crowdfundingId + `/donations`;
const urlGetComments = crowdfundingId => apiPath + `/crowdfundings/` + crowdfundingId + `/comments`;
// TODO create,update and delete
// TODO donate

class Crowdfunding extends Component {
  constructor(props) {
      super(props);
      this.state = { requestFailed: false,
          crowdfundingId: this.props.match.params.crowdfunding_id,
          donator_id: 2,
          comments: []
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  getComments() {
      fetch(urlGetComments(this.state.crowdfundingId), {
          method: 'GET'
      }).then(res => {
          if(res.status === 200) {
              res.json()
                .then(data => {
                    this.setState({comments: data});
                })
          }
      })
  }

    componentDidMount() {
        console.log(this.props)
        //DATA REQUEST
        fetch(urlForData(this.state.crowdfundingId))
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
        fetch(urlForRating(this.state.crowdfundingId))
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
        /*fetch(urlForDonations(this.state.crowdfundingId))
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
        /*fetch(urlForServices(this.state.crowdfundingId))
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
        this.getComments();
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleSubmit = (event) => {
        //this.setState({ amount: "" });
        alert(JSON.stringify({
            id:this.state.crowdfundingId,
            donator_id:this.state.donator_id,
            amount:this.state.amount
        }));
        fetch(urlForDonate(this.state.crowdfundingId), {
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

      // Comments.
      let comments;
      if(this.state.comments) {
        comments = this.state.comments.map(comment => {
            return (
                <CommentComp comment={comment}/>
            )
        })
      } else {
          comments = 
            <Container>
                <p>No comments yet</p>
            </Container>
      }

      return (
        <Container className="main-container" id="crowdfunding_base_container" fluid={true}>
            <Container textAlign="center">
              <Header as="h1" id="crowdfunding_mission">Mission</Header>
            </Container>
            <Container>
                <p><strong>{this.state.crowdfunding.title}</strong> <Icon name="circle" size="tiny" flipped="horizontally"/><text>{this.state.crowdfunding.category}</text></p>
            </Container>
              <Responsive as={MygrantDividerLeft} minWidth={768} className="intro-divider" color="purple" />
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
                <Grid stackable columns={3}>
                    <Grid.Column width={9}>
                        <h4 align="center">Services</h4>
                        <Item.Group divided>
                            <Item>
                                <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>title</Item.Header>
                                    <Item.Meta><a>category</a> <a>owner</a></Item.Meta>
                                    <Item.Description>status</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See Details</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>title</Item.Header>
                                    <Item.Meta><a>category</a> <a>owner</a></Item.Meta>
                                    <Item.Description>status</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See Details</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>title</Item.Header>
                                    <Item.Meta><a>category</a> <a>owner</a></Item.Meta>
                                    <Item.Description>status</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See Details</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>title</Item.Header>
                                    <Item.Meta><a>category</a> <a>owner</a></Item.Meta>
                                    <Item.Description>status</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See Details</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Grid.Column>
                    <Grid.Column width={1}>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <h4 align="center">Donators</h4>
                        <Item.Group divided>
                            <Item>
                                <Item.Image size='tiny' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>Name</Item.Header>
                                    <Item.Meta><a>rating</a> <a>value</a></Item.Meta>
                                    <Item.Description>Amount</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See profile</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>Name</Item.Header>
                                    <Item.Meta><a>rating</a> <a>value</a></Item.Meta>
                                    <Item.Description>Amount</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See profile</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                            <Item>
                                <Item.Image size='small' src='/assets/images/wireframe/image.png' />

                                <Item.Content verticalAlign='middle'>
                                    <Item.Header>Name</Item.Header>
                                    <Item.Meta><a>rating</a> <a>value</a></Item.Meta>
                                    <Item.Description>Amount</Item.Description>
                                    <Item.Extra>
                                        <Button  floated="right">See profile</Button>
                                    </Item.Extra>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Grid.Column>
                </Grid>
            </Container>
            <Container>
                <h3>Comments</h3>
            </Container>
            <Responsive as={MygrantDividerLeft} minWidth={768} className="intro-divider" color="purple" />
            {comments}
            {/*<Container id="crowdfunding_comments">
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
            </Container>*/}
          </Container>
      );
  }
}

export default Crowdfunding;
