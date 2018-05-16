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
    }

    render () {
        return (
            <div>
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
                                this.props.header || this.props.comment ? null
                                    : <Grid.Column width={2}>
                                        <Image circular src={`/api/images/${this.props.user.pictureUrl}`}/>
                                    </Grid.Column>
                            }
                            <Grid.Column width={this.props.header || this.props.comment ? 16 : 14}>
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
                                            <Header as={this.props.header ? 'h3' : 'h4'}>
                                                {
                                                    this.props.comment
                                                    ? <Image size={'tiny'} centered avatar src={`/api/images/${this.props.user.pictureUrl}`}/>
                                                    : null
                                                }
                                                {this.props.user.fullName}
                                            </Header>
                                            {
                                                this.props.header
                                                    ? <Header.Subheader verticalAlign={'top'}>
                                                        {this.props.postInfo.datePosted}
                                                    </Header.Subheader>
                                                    : null
                                            }
                                            {
                                                this.props.comment
                                                    ? <span className={`${this.props.comment ? 'comment-date' : ''}`}>{this.props.postInfo.datePosted}</span>
                                                    : null
                                            }
                                        </Grid.Column>
                                        {
                                            this.props.header
                                                ? null
                                                : <Grid.Column width={6} textAlign={'right'} >

                                                    {
                                                        this.props.comment
                                                            ? <span className={'post-likes'}>{this.props.postInfo.likes}
                                                                <Icon className={'post-likes-icon'} name={'like outline'}/>
                                                            </span>
                                                            : null
                                                    }
                                                </Grid.Column>
                                        }
                                    </Grid.Row>
                                    <Grid.Row className={'content'} verticalAlign={'top'} >
                                        <Grid.Column width={16} >
                                            { this.props.header ? <h3>{this.props.postInfo.content}</h3> : null }
                                            { this.props.linked ? <Link to={`/post/${this.props.postInfo.id}`}>{this.props.postInfo.content}</Link> : null }
                                            { this.props.comment ? this.props.postInfo.content : null }
                                        </Grid.Column>
                                    </Grid.Row>
                                    {
                                        this.props.comment
                                            ? null
                                            : <Grid.Row textAlign={'left'}>
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
                                                    <Icon className={'post-likes-icon'} name={'ellipsis horizontal'}/>
                                                </Grid.Column>
                                            </Grid.Row>
                                    }
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

export default Post;
