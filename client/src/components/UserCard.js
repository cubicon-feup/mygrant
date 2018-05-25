import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { Image, Grid, Rating } from 'semantic-ui-react';

const urlToUser = id => `/api/users/${id}`;
const urlToUserRating = id => `/api/users/${id}/rating`;

class UserCard extends Component {
    static propTypes = { data: instanceOf(Object).isRequired };

    constructor(props) {
        super(props);
        this.state = {
            error: true,
            touched: false,
            user: {}
        };
    }

    componentDidMount() {
        fetch(urlToUser(this.props.data.creator_id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({ user: result });
                    this.fetchUserRating();
                },
                () => console.log('ERROR')
            );
    }

    fetchUserRating() {
        fetch(urlToUserRating(this.props.data.creator_id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({
                        user: {
                            ...this.state.user,
                            result
                        }
                    });
                },
                () => console.log('ERROR')
            );
    }

    render() {
        var ncols = this.props.data.mygrant_target ? 3 : 2;

        return (
            <Grid centered columns={ncols}>
                <Grid.Column>
                    <Image size="tiny" src={this.state.user.image_url} />
                </Grid.Column>
                <Grid.Column>
                    <Grid.Row>{this.state.user.full_name}</Grid.Row>
                    <Grid.Row>
                        <Rating
                            disabled
                            icon="star"
                            defaultRating={this.state.user.rating}
                            maxRating={5}
                        />
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        );
    }
}

export default UserCard;
