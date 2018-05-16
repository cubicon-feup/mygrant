import React, { Component } from 'react';
import { Container, Grid, Header, Image, Segment } from 'semantic-ui-react';
import { instanceOf, PropTypes } from 'prop-types';
import moment from 'moment';

class Post extends Component {
    static propTypes = {
        content: PropTypes.string.isRequired,
        datePosted: PropTypes.string.isRequired,
        likes: PropTypes.number.isRequired,
        user: instanceOf(Object).isRequired
    };

    render() {
        return (
            <Segment className={'blog-post'} >
                <Container >
                    <Grid padded >
                        <Grid.Row>
                            <Grid.Column width={2}>
                                <Image circular src={`/api/images/${this.props.user.pictureUrl}`}/>
                            </Grid.Column>
                            <Grid.Column width={14}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={10}>
                                            <Header as={'h4'}>{this.props.user.fullName}</Header>
                                        </Grid.Column>
                                        <Grid.Column width={6} textAlign={'right'} verticalAlign={'top'} >
                                            <Header.Subheader>{this.props.datePosted}</Header.Subheader>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row className={'content'} verticalAlign={'top'} >
                                        <Grid.Column width={16} >
                                            {this.props.content}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
        );
    }
}

export default Post;
