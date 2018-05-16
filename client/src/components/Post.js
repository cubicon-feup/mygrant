import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';
import { instanceOf } from 'prop-types';
import moment from 'moment';

class Post extends Component {
    static propTypes = {
        postInfo: instanceOf(Object).isRequired,
        user: instanceOf(Object).isRequired
    };

    render() {
        return (
            <Link to={`/post/${this.props.postInfo.id}`}>
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
                                            <Header.Subheader>{this.props.postInfo.datePosted}</Header.Subheader>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row className={'content'} verticalAlign={'top'} >
                                        <Grid.Column width={16} >
                                            {this.props.postInfo.content}
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row textAlign={'left'}>
                                        <Grid.Column width={2}>
                                            <Icon name={'comment outline'}/>{this.props.postInfo.commentCount}
                                        </Grid.Column>
                                        <Grid.Column width={2}>
                                            <Icon name={'like outline'}/>{this.props.postInfo.likes}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
    </Link>
        );
    }
}

export default Post;
