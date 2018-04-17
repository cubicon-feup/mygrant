import React, { Component } from 'react';
import { Button, Container, Divider, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import '../css/App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { info: [] };
  }

  componentDidMount() {
    fetch('/api/app_info')
      .then(res => res.json())
      .then(info => this.setState({ info }));
  }

  render() {
    return (
        <Container fluid className="main-container">

            { /* Buttons Start */ }
            <Container className="landing-page-buttons" >
                <Grid columns={3} > 
                    <Grid.Row >
                        <Grid.Column floated="right" >
                            <Button fluid circular className="mygrant-button" >Log In</Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column floated="right" >
                            <Button fluid circular className="mygrant-button">Sign Up</Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign="center" >
                        <Grid.Column floated="right" >
                            <Icon name="fas fa-circle" />
                            <Icon name="fas fa-circle" />
                            <Icon name="fas fa-circle" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column floated="right" >
                            <Button fluid circular color="facebook" verticalAlign="middle" >
                                <Icon name="fab fa-facebook-f" />Log In with Facebook
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
            { /* Buttons End */ }

            { /* Segment Start */ }
            <Container fluid className="oneliner-container" >
                <Segment floated="right" size="big" className="oneliner-segment" >
                    <Grid columns={2} >
                        <Grid.Row >
                            <Grid.Column floated="right" textAlign="center" >
                                <Header size="huge" >Glocal Exchange Trading System</Header>
                                <Header.Subheader >Your service-based system for community building</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Container>
            { /* Segment End */ }

            { /* Intro Start */ }
            <Container fluid>
                <Grid columns={6} >
                    <Grid.Row >
                        <Grid.Column textAlign="center" >
                            <Header size="huge" className="intro-header" >What is mygrant?</Header>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
            <Divider className="intro-divider first-divider" />
            <Divider className="intro-divider second-divider" />
            <Container className="intro-container" >
                <Grid columns={2} >
                    <Grid.Row >
                        <Grid.Column >
                            Mygrant is a free and user-friendly platform for trading proximity services
                            in your local community and beyond.
                            Mygrant is inspired on “Fureai Kippu”, a Japanese currency created in 1995 by the Sawayaka Welfare
                            Foundation so that people could earn credits helping seniors in their community.
                            The platform aims to provide a place where the user can feel like a part of a community,
                            exchanging services like cleaning the leaves or give a ride to the airport, by a currency called Mygrant.
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
            { /* Intro End */ }

            { /* Use Cases Start */ }
            <Container fluid className="use-case-container" >
                <Segment size="massive" className="use-case-segment" >
                    <Header size="big" textAlign="center" >How we can help at home and abroad</Header>
                </Segment>
                <Grid columns={3} textAlign="center" >
                    <Grid.Row >
                        <Grid.Column>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row >
                    </Grid.Row>
                </Grid>
            </Container>
            { /* Use Cases End */ }

        </Container>
    );
  }
}

export default App;
