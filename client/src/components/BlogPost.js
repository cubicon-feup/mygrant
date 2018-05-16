import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';
import { instanceOf, PropTypes } from 'prop-types';
import moment from 'moment';

class BlogPost extends Component {
    static propTypes = {
        linked: PropTypes.bool,
        postInfo: instanceOf(Object).isRequired,
        user: instanceOf(Object).isRequired
    };

    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div>
                <Segment
                    className={`blog-post ${this.props.linked ? 'linked' : ''}`} >
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
                                                <Header as={'h4'}>
                                                    {this.props.user.fullName}
                                                </Header>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row className={'content'} verticalAlign={'top'} >
                                            <Grid.Column width={16} >
                                                {
                                                    this.props.linked
                                                        ? <Link to={`/post/${this.props.postInfo.id}`}>{this.props.postInfo.content}</Link>
                                                        : this.props.postInfo.content }
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

export default BlogPost;
