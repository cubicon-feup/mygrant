import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';
import { instanceOf, PropTypes } from 'prop-types';
import moment from 'moment';

class BlogHeaderPost extends Component {
    static propTypes = {
        postInfo: instanceOf(Object).isRequired,
        user: instanceOf(Object).isRequired
    };

    constructor(props) {
        super(props);
    }


    render () {
        return (
            <div>
                <Segment className={'blog-post header-post'} >
                    <Container >
                        <Grid padded >
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column width={2}>
                                                <Image circular src={`/api/images/${this.props.user.pictureUrl}`}/>
                                            </Grid.Column>
                                            <Grid.Column width={14}>
                                                <Header as={'h3'}>
                                                    {this.props.user.fullName}
                                                </Header>
                                                <Header.Subheader verticalAlign={'top'}>
                                                    {this.props.postInfo.datePosted}
                                                </Header.Subheader>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row className={'content'} verticalAlign={'top'} >
                                            <Grid.Column width={16} >
                                                <h3>{this.props.postInfo.content}</h3>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row textAlign={'left'}>
                                            <Grid.Column width={2}>
                                                <Icon name={'comment outline'}/>{this.props.postInfo.commentCount}
                                            </Grid.Column>
                                            <Grid.Column width={2}>
                                                <span className={'post-likes'}>
                                                    <Icon className={'post-likes-icon'} name={'like outline'}/>
                                                    {this.props.postInfo.likes}
                                                </span>
                                            </Grid.Column>
                                            <Grid.Column width={2}>
                                                <Icon className={'post-options'} name={'ellipsis horizontal'}/>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </Segment>
            </div>
        );
    }
}

export default BlogHeaderPost;
