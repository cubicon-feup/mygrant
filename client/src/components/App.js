import React, { Component } from 'react';
import { Button, Container, Grid, Header, Icon } from 'semantic-ui-react';
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
                            <Button fluid circular color="facebook">
                                <Icon name="fab fa-facebook" />Log In with Facebook
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Container>
    );
  }
}

export default App;
