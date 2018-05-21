import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';
import { instanceOf, PropTypes } from 'prop-types';
import moment from 'moment';

class BlogComment extends Component {
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
                <Segment className={'blog-post post-comment'} >
                <Container >
                    <Grid padded >
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={10}>
                                            <Header as={'h4'}>
                                                <Image size={'tiny'} centered avatar src={`/api/images/${this.props.user.pictureUrl}`}/>
                                                {this.props.user.fullName}
                                            </Header>
                                            <span className={'comment-date'}>
                                                {moment(this.props.postInfo.datePosted).fromNow()}
                                                <Icon className={'post-options'} name={'ellipsis horizontal'}/>
                                            </span>
                                        </Grid.Column>
                                        <Grid.Column width={6} textAlign={'right'} >
                                            <span className={'post-likes'}>{this.props.postInfo.likes}
                                                <Icon className={'post-likes-icon'} name={'like outline'}/>
                                            </span>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row className={'content'} verticalAlign={'top'} >
                                        <Grid.Column width={16} >
                                            {this.props.postInfo.content}
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

export default BlogComment;
