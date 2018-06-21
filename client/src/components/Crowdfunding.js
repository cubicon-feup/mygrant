import React, { Component } from 'react';
import '../css/Crowdfunding.css';

import { Container, Header, Grid, Divider, Image, Icon, Item, Rating, Loader,Progress, Responsive, Form, Button} from 'semantic-ui-react';
import { MygrantDividerLeft, MygrantDividerRight } from './Common';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import CrowdfundingOffers from './service_offers/CrowdfundingOffers';
import Donator from './Donator';
import CommentsSection from './Comments';
import PidgeonMaps from './Map';

const apiPath = require('../config').apiPath;
const urlForData = crowdfundingId => `/api/crowdfundings/` + crowdfundingId;
const urlForRating = crowdfundingId => `/api/crowdfundings/` + crowdfundingId + `/rating`;
const urlForDonations = crowdfundingId => `/api/crowdfundings/` + crowdfundingId  + `/donations`;
const urlForServices = crowdfundingId => `/api/crowdfundings/` + crowdfundingId + `/services`;
const urlForDonate = crowdfundingId => `/api/crowdfundings/` + crowdfundingId + `/donations`;
const urlGetDonators = crowdfundingId => `/api/crowdfundings/` + crowdfundingId + `/donations`;
const urlForStartCollecting = crowdfundingId => `/api/crowdfundings/` + crowdfundingId + `/start_collecting`;
const Role = require('../Role').role;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

class Crowdfunding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crowdfunding: {},
            requestFailed: false,
            crowdfundingId: this.props.match.params.crowdfunding_id,
            donators: [],
            timeDiff: '',
            role: Role.NONE,

            timer: null,
            counter: 0,

            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.tick = this.tick.bind(this);
        this.startCollecting = this.startCollecting.bind(this);

        const { cookies } = this.props;
        console.log(cookies);
    }

    componentDidMount() {
        this.getData();
        this.getRating();
        this.getDonators();

        let timer = setInterval(this.tick, 1000);
        this.setState({timer});
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    assignRole() {
        const { cookies } = this.props;
        let userId = cookies.get('user_id');
        if(userId == this.state.crowdfunding.creator_id)
            this.setState({role: Role.CROWDFUNDING_CREATOR})
        else if(userId)
            this.setState({role: Role.AUTHENTICATED})
        console.log("Role: " + this.state.role);
    }

    getDonators() {
        fetch(urlGetDonators(this.state.crowdfundingId), {
            method: 'GET'
        }).then(res => {
            if(res.status === 200) {
                res.json()
                    .then(data => {
                        this.setState({donators: data});
                    })
            }
        })
    }

    getData(){
        fetch(urlForData(this.state.crowdfundingId))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                this.setState({ crowdfunding: result });
                let timeDiff = new Date(result.date_finished) - new Date().getTime();
                if(this.state.crowdfunding.status !== 'FINISHED')
                    this.setState({ timeDiff: timeDiff});
                this.assignRole();
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
    }

    tick() {
        if(this.state.timeDiff <= 0) {
            clearInterval(this.state.timer);
            // this.getData();
        }

        this.setState({days: Math.floor(this.state.timeDiff / day)})
        this.setState({hours: Math.floor((this.state.timeDiff % day) / hour)})
        this.setState({minutes: Math.floor((this.state.timeDiff % hour) / minute)})
        this.setState({seconds: Math.floor((this.state.timeDiff % minute) / second)})
        this.setState({timeDiff: this.state.timeDiff - 1000});
    }
    
    startCollecting() {
        const { cookies } = this.props;
        fetch(urlForStartCollecting(this.state.crowdfundingId), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.get('id_token')}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                this.setState({ crowdfunding: {status: 'COLLECTING'} });
            });
    }

    getRating(){
        fetch(urlForRating(this.state.crowdfundingId))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(result => {
                this.setState({ rating: result });
                if(!this.state.rating.average_rating){
                    this.setState({ rating: { average_rating : "No rating"}});
                }
            }, () => {
                // "catch" the error
                this.setState({ requestFailed: true });
            });
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value });

    handleSubmit = (event) => {
        const { cookies } = this.props;
        fetch(urlForDonate(this.state.crowdfundingId), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cookies.get('id_token')}`
            },
            body: JSON.stringify({
                amount: parseInt(this.state.amount)
            })
        }).then(res => {
            if(res.status === 201) {
                let newDonator = {
                    donator_id: cookies.get('user_id'),
                    donator_name: cookies.get('user_full_name'),
                    amount: this.state.amount
                }
                let donators = this.state.donators;
                donators.push(newDonator);
                this.setState({donators: donators});
            }
        })
    }
    
    getProgress() {
        if (this.state.crowdfunding.status !== 'RECRUITING') {
            return (
                <div>
                    <Progress progress='percentage' value={this.state.crowdfunding.collected_balance} precision={0} total={this.state.crowdfunding.recruiting_balance} size="small" color='green' active={true}/>
                    <p id="crowdfunding_earned">Earned : {this.state.crowdfunding.collected_balance}
                    <div id="crowdfunding_target">Target : {this.state.crowdfunding.recruiting_balance}</div>
                    </p>
                </div>
            )
        }
        else {
            return (
                <div id="crowdfunding_target">Target : {this.state.crowdfunding.recruiting_balance}</div>
            )
        }
    }
    
    renderMap() {
        if (this.state.crowdfunding.latitude && this.state.crowdfunding.longitude) {
            return (
                <PidgeonMaps
                    latlng={[
                        this.state.crowdfunding.latitude,
                        this.state.crowdfunding.longitude
                    ]}
                />
            );
        }
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
      
      let startCollecting;
      if (this.state.role == Role.CROWDFUNDING_CREATOR && this.state.crowdfunding.status === 'RECRUITING') {
          startCollecting = <Button onClick={this.startCollecting}>Start Collecting</Button>
      }
      else {
          startCollecting = null;
      }

      let donate;
      if(this.state.role != Role.CROWDFUNDING_CREATOR && this.state.role != Role.NONE && this.state.crowdfunding.status === 'COLLECTING')
        donate =
            <Form id="crowdfunding_donate" method="POST" onSubmit={this.handleSubmit}>
                <Grid stackable centered>
                    <Grid.Column width={14}>
                    <Form.Input type='number' placeholder='Amount' name="amount" value={this.state.amount} onChange={this.handleChange}/>
                    </Grid.Column>
                    <Grid.Column width={2} className="centered aligned">
                        <Form.Button content="Donate"/>
                    </Grid.Column>
                </Grid>
            </Form>
        else donate = null;

      let donators;
      if(this.state.donators) {
        donators = this.state.donators.map(function(donator,index,array) {
            if( index == 0 ) {
                return (
                    <Donator donator={donator}/>
                );
            }
            return (
                <div>
                    <Divider />
                    <Donator donator={donator}/>
                </div>
            );
          });
      } else
          donators =
            <p>No donators for now</p>

        let statusExplanation;
        if(this.state.crowdfunding.status === 'COLLECTING')
            statusExplanation =
                <p>Actively searching for donations.</p>
        else if(this.state.crowdfunding.status === 'RECRUITING')
            statusExplanation =
                <p>Recruiting service providers.</p>
        else if(this.state.crowdfunding.status === 'FINISHED')
            statusExplanation =
                <p>This mission has finished its collecting and rcruitment process.</p>

        let timer;
        if(this.state.crowdfunding.status === 'FINISHED')
            timer = <p>Already ended</p>;
        else timer = <p>{this.state.days} days, {this.state.hours} hours, {this.state.minutes} minutes, {this.state.seconds} seconds</p>
        
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
                  {startCollecting}
                  <Grid stackable columns={2} className="crowdfunding_grid">
                      <Grid.Column width={6} className="left_col">
                          <Image src='/img/mission.png' />
                          <div id="crowdfunding_progress">
                              <h5>Current State: {this.state.crowdfunding.status}</h5>
                              {statusExplanation}
                              {this.getProgress()}
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
                                          <Image size='tiny' src='/img/user.jpg' />
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
                                  <h4>Ends in</h4>
                                  {timer}
                              </Grid.Column>
                          </Grid>

                          {donate}

                      </Grid.Column>
                  </Grid>
              </Container>
            <Responsive as={MygrantDividerRight} minWidth={768} className="intro-divider" color="green" />
            <Container id="services_donators">
                <Grid stackable columns={3}>
                    <Grid.Column width={9}>
                        <CrowdfundingOffers crowdfundingId={this.state.crowdfundingId} crowdfundingCreatorId={this.state.crowdfunding.creator_id} crowdfundingStatus={this.state.crowdfunding.status}/>
                        {/*<h4 align="center">Services</h4>
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
                        </Item.Group>*/}
                    </Grid.Column>
                    <Grid.Column width={1}>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <h3 align="center">Donators</h3>
                        <Item.Group divided>
                            {donators}
                        </Item.Group>
                        {/*<h4 align="center">Donators</h4>
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
                        </Item.Group>*/}
                    </Grid.Column>
                </Grid>
            </Container>
            {this.renderMap()}
            <CommentsSection type="crowdfundings" id={this.state.crowdfundingId} />
            {/*<Container>
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
            </Container>*/}
          </Container>
      );
  }
}

export default withCookies(Crowdfunding);
