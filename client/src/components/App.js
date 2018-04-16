import React, { Component } from 'react';
import { Button, Container, Grid, Icon } from 'semantic-ui-react';
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
        <Container className="main-container">
            <Grid columns={2}>
                <Grid.Row>
                    <Grid.Column></Grid.Column>
                    <Grid.Column>
                        <Button fluid circular className="mygrant-button" >Log In</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column></Grid.Column>
                    <Grid.Column>
                        <Button fluid circular className="mygrant-button">Sign Up</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column></Grid.Column>
                    <Grid.Column>
                        <Button fluid circular color="facebook">
                            <Icon name="fab fa-facebook" />Log In with Facebook
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
  }
}

export default App;
