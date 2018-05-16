import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';
import { instanceOf, PropTypes } from 'prop-types';
import moment from 'moment';

class Post extends Component {
    static propTypes = {
        comment: PropTypes.bool,
        header: PropTypes.bool,
        linked: PropTypes.bool,
        postInfo: instanceOf(Object).isRequired,
        user: instanceOf(Object).isRequired
    };

    constructor(props) {
        super(props);

        this.content =
            <Segment className={
                `blog-post 
                ${this.props.linked ? 'linked' : ''}
                ${this.props.header ? 'header-post' : ''}
                ${this.props.comment ? 'post-comment' : ''}`
            } >
            <Container >
                <Grid padded >
                    <Grid.Row>
                        {
                            this.props.header ? null
                                : <Grid.Column width={2}>
                                    <Image circular src={`/api/images/${this.props.user.pictureUrl}`}/>
                                </Grid.Column>
                        }
                        <Grid.Column width={14}>
                            <Grid>
                                <Grid.Row>
                                    {
                                        this.props.header
                                            ? <Grid.Column width={2}>
                                                <Image circular src={`/api/images/${this.props.user.pictureUrl}`}/>
                                            </Grid.Column>
                                            : null
                                    }
                                    <Grid.Column width={this.props.header ? 14 : 10}>
                                        <Header as={this.props.header ? 'h3' : 'h4'}>{this.props.user.fullName}</Header>
                                        {
                                            this.props.header
                                                ? <Header.Subheader>{this.props.postInfo.datePosted}</Header.Subheader>
                                                : null
                                        }
                                    </Grid.Column>
                                    {
                                        this.props.header ? null
                                            : <Grid.Column width={6} textAlign={'right'} verticalAlign={'top'} >
                                                <Header.Subheader>{this.props.postInfo.datePosted}</Header.Subheader>
                                            </Grid.Column>
                                    }
                                </Grid.Row>
                                <Grid.Row className={'content'} verticalAlign={'top'} >
                                    <Grid.Column width={16} >
                                        {this.props.header ? <h3>{this.props.postInfo.content}</h3> : this.props.postInfo.content}
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row textAlign={'left'}>
                                    {
                                        this.props.comment ? null
                                        : <Grid.Column width={2}>
                                            <Icon name={'comment outline'}/>{this.props.postInfo.commentCount}
                                        </Grid.Column>
                                    }
                                    <Grid.Column width={2}>
                                        <Icon name={'like outline'}/>{this.props.postInfo.likes}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </Segment>;
    }

    // If the post is not a head post or a comment, render a link to it
    render() {
        return (
            <div>
                {
                    this.props.linked
                        ? <Link to={`/post/${this.props.postInfo.id}`}>
                            {this.content}
                        </Link>
                        : this.content
                }
            </div>
        );
    }
}

export default Post;
