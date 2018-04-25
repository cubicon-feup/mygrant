import React, { Component } from 'react';
import { Button, Container, Grid, Header, Icon, Responsive, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { MygrantDivider } from '../components/Common';
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

            { /* Mobile only header */ }
            <Responsive maxWidth={768} className="mobile-only-header" textAlign="center" size="huge" as={Header} >mygrant</Responsive>

            { /* Buttons Start */ }
            <Container className="landing-page-buttons" >
                <Grid > 
                    <Grid.Row >
                        <Grid.Column computer={6} mobile={16} floated="right" >
                            <Link to='/login'><Button fluid circular className="mygrant-button" >Log In</Button></Link>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column computer={6} mobile={16} floated="right" >
                            <Link to='/signup'><Button fluid circular className="mygrant-button">Sign Up</Button></Link>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row textAlign="center" >
                        <Grid.Column computer={6} mobile={16} floated="right" >
                            <Icon name="fas fa-circle" />
                            <Icon name="fas fa-circle" />
                            <Icon name="fas fa-circle" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column computer={6} mobile={16} floated="right" >
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

                { /* Computer only start */ }
                <Responsive as={Segment} minWidth={768} floated="right" size="big" className="oneliner-segment" >
                    <Grid columns={2} >
                        <Grid.Row >
                            <Grid.Column floated="right" textAlign="center" >
                                <Header size="huge" >Glocal Exchange Trading System</Header>
                                <Header.Subheader >Your service-based system for community building</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Responsive>
                { /* Computer only end */ }

                { /* Mobile only start */ }
                <Responsive as={Segment} maxWidth={768} fluid size="big" className="oneliner-segment-mobile" >
                    <Grid >
                        <Grid.Row >
                            <Grid.Column textAlign="center" >
                                <Header size="huge" >Glocal Exchange Trading System</Header>
                                <Header.Subheader >Your service-based system for community building</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Responsive>
                { /* Mobile only end */ }

            </Container>
            { /* Segment End */ }

            { /* Intro Start */ }
            <Container fluid>
                <Grid >
                    <Grid.Row >
                        <Grid.Column mobile={16} computer={6} textAlign="center" >
                            <Header size="huge" className="intro-header" >What is mygrant?</Header>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
            <Responsive as={MygrantDivider} minWidth={768} className="intro-divider" color="purple" />
            <Container className="intro-container" >
                <Grid >
                    <Grid.Row >
                        <Grid.Column mobile={16} computer={8} >
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
                { /* Computer only start */ }
                <Responsive as={Segment} minWidth={768} className="use-case-segment" >
                    <Header as="h1" textAlign="center" >How we can help at home and abroad</Header>
                    <Grid columns={3} >
                        <Grid.Row textAlign="center" >
                            <Grid.Column>
                                <p><Icon className="far fa-money-bill-alt fa-10x" /></p>
                                <Header.Subheader>Acess a Trading System</Header.Subheader>
                            </Grid.Column>
                            <Grid.Column>
                                <p><Icon className="fas fa-users fa-10x" /></p>
                                <Header.Subheader >Crowdfund your community's activities</Header.Subheader>
                            </Grid.Column>
                            <Grid.Column>
                                <p><Icon className="fas fa-wrench fa-10x" /></p>
                                <Header.Subheader >Find useful services nearby</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row textAlign="center" >
                            <Grid.Column>
                                <p><Icon className="fas fa-university fa-10x" /></p>
                                <Header.Subheader >Get administrative and cultural help</Header.Subheader>
                            </Grid.Column>
                            <Grid.Column>
                                <p><Icon className="fas fa-info-circle fa-10x" /></p>
                                <Header.Subheader >Get info from local agents</Header.Subheader>
                            </Grid.Column>
                            <Grid.Column>
                                <p><Icon className="far fa-compass fa-10x" /></p>
                                <Header.Subheader >Discover places that don't come in guidebooks</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Responsive>
                { /* Computer only end */ }

                { /* Mobile only start */ }
                <Responsive as={Container} maxWidth={768} className="use-case-mobile" >
                    <Header as="h1" textAlign="center" >How we can help at home and abroad</Header>
                    <Grid>
                        <Grid.Row textAlign="center" >
                            <Grid.Column>
                                <p><Icon className="far fa-money-bill-alt fa-10x" /></p>
                                <Header.Subheader>Acess a Trading System</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row textAlign="center" >
                            <Grid.Column>
                                <p><Icon className="fas fa-users fa-10x" /></p>
                                <Header.Subheader >Crowdfund your community's activities</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row textAlign="center" >
                            <Grid.Column>
                                <p><Icon className="fas fa-wrench fa-10x" /></p>
                                <Header.Subheader >Find useful services nearby</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row textAlign="center" >
                            <Grid.Column>
                                <p><Icon className="fas fa-university fa-10x" /></p>
                                <Header.Subheader >Get administrative and cultural help</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row textAlign="center" >
                            <Grid.Column>
                                <p><Icon className="fas fa-info-circle fa-10x" /></p>
                                <Header.Subheader >Get info from local agents</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row textAlign="center" >
                            <Grid.Column>
                                <p><Icon className="far fa-compass fa-10x" /></p>
                                <Header.Subheader >Discover places that don't come in guidebooks</Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Responsive>
                { /* Mobile only end */ }
            </Container>
            { /* Use Cases End */ }
        </Container>
    );
  }
}

export default App;
