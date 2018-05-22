import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Container, Header, Grid, Divider, Image, Icon, Item, Rating, Loader,Progress, Responsive, Form} from 'semantic-ui-react';


class Dashboard extends Component {
    static propTypes = { cookies: instanceOf(Cookies).isRequired };

    constructor(props) {
        super(props);

    }

    // Crowdfundings that the user supported.
    getCrowdfundingsToRate() {

    }

    // Services that the user provided.
    getServicesProvidedToRate() {

    }

    // Services that the user was a candidate and was accepted.
    getServicesRequestedToRate() {

    }

    render() {
        return (
            <Container>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <p>My mygrants: </p>
                <p>Ratings to give </p>

            <Container id="services_donators">
                <Grid stackable columns={3}>
                    <Grid.Column width={9}>
                        <h2>Cenas</h2>
                    </Grid.Column>
                    <Grid.Column width={1}>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <h3 align="center">Donators</h3>

                    </Grid.Column>
                </Grid>
            </Container>

            </Container>
        )
    }
}

export default withCookies(Dashboard);