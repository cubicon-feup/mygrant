import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Container, Dropdown, Grid, Header, Icon, Image, Responsive } from 'semantic-ui-react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import moment from 'moment';
import NewPost from '../components/NewPost';

class BlogHeaderPost extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        postInfo: instanceOf(Object).isRequired,
        user: instanceOf(Object).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            deleted: false,
            editing: false,
            liked: Boolean(parseInt(this.props.postInfo.liked, 10)),
            nLikes: parseInt(this.props.postInfo.likes, 10),
            postContent: this.props.postInfo.content
        };
    }

    handleLike() {
        const { cookies } = this.props;
        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };

        // Make request to the api to add a like, and toggle like in state
        if (this.state.liked) {
            fetch(`/api/posts/${this.props.postInfo.id}/like`, {
                headers,
                method: 'DELETE'
            })
                .then(res => {
                    this.setState({
                        liked: !res.status === 204,
                        nLikes: this.state.nLikes - 1
                    });
                });
        } else {
            fetch(`/api/posts/${this.props.postInfo.id}/like`, {
                headers,
                method: 'POST'
            })
                .then(res => {
                    this.setState({
                        liked: res.status === 201,
                        nLikes: this.state.nLikes + 1
                    });
                });
        }

    }

    editPost() {
        this.setState({ editing: true });
    }

    cancelEditing() {
        this.setState({ editing: false });
    }

    completeEditing(content) {
        if (content === '') {
            return;
        }

        const { cookies } = this.props;
        const headers = {
            Authorization: `Bearer ${cookies.get('id_token')}`,
            'content-type': 'application/json'
        };

        const data = { content };

        // API request to edit the content of the post
        fetch(`/api/posts/${this.props.postInfo.id}/edit`, {
            body: JSON.stringify(data),
            headers,
            method: 'POST'
        })
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        editing: false,
                        postContent: content
                    });
                }
            });
    }

    deletePost() {
        const { cookies } = this.props;
        const headers = { Authorization: `Bearer ${cookies.get('id_token')}` };

        // API request to delete the post
        fetch(`/api/posts/${this.props.postInfo.id}/delete`, {
            headers,
            method: 'DELETE'
        })
            .then(res => {
                if (res.status === 204) {
                    // Post was deleted
                    this.setState({ deleted: true });
                }
            });
    }

    render () {
        const { cookies } = this.props;
        const canEdit = parseInt(cookies.get('user_id'), 10) === this.props.user.id;

        const newPost = <NewPost onCancel={this.cancelEditing.bind(this)} handleClick={this.completeEditing.bind(this)} />;

        const headerPost =
            <div>
                <Container >
                    <Grid padded >
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Grid>
                                    <Grid.Row>
                                        <Responsive href={`/user/${this.props.user.id}`} as={Grid.Column} width={2} minWidth={768} >
                                            <Image circular src={`/api/images/${this.props.user.pictureUrl}`}/>
                                        </Responsive>
                                        <Responsive as={Grid.Column} width={14} minWidth={768} >
                                            <Link to={`/user/${this.props.user.id}`} >
                                                <Header as={'h3'}>
                                                    {this.props.user.fullName}
                                                </Header>
                                            </Link>
                                            <Header.Subheader verticalAlign={'top'}>
                                                {moment(this.props.postInfo.datePosted).fromNow()}
                                            </Header.Subheader>
                                        </Responsive>
                                        <Responsive as={Grid.Column} width={4} maxWidth={768} >
                                            <Image href={`/user/${this.props.user.id}`} circular src={`/api/images/${this.props.user.pictureUrl}`}/>
                                        </Responsive>
                                        <Responsive as={Grid.Column} width={12} maxWidth={768} >
                                            <Link to={`/user/${this.props.user.id}`} >
                                                <Header as={'h3'}>
                                                    {this.props.user.fullName}
                                                </Header>
                                            </Link>
                                            <Header.Subheader verticalAlign={'top'}>
                                                {moment(this.props.postInfo.datePosted).fromNow()}
                                            </Header.Subheader>
                                        </Responsive>
                                    </Grid.Row>
                                    <Grid.Row className={'content'} verticalAlign={'top'} >
                                        <Grid.Column width={16} >
                                            <h3>{this.state.postContent}</h3>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row textAlign={'left'}>
                                        <Grid.Column width={2}>
                                            <Icon name={'comment outline'}/>{this.props.postInfo.commentCount}
                                        </Grid.Column>
                                        <Grid.Column width={2}>
                                            <span className={'post-likes'} onClick={this.handleLike.bind(this)}>
                                                {
                                                    this.state.liked
                                                    ? <Icon className={'post-likes-icon'} color={'red'} name={'like'}/>
                                                    : <Icon className={'post-likes-icon'} name={'like outline'}/>
                                                }
                                                {this.state.nLikes}
                                            </span>
                                        </Grid.Column>
                                        <Grid.Column width={2}>
                                            {
                                                canEdit
                                                ? <Dropdown icon={'ellipsis horizontal'} className={'post-options'} >
                                                    <Dropdown.Menu >
                                                        <Dropdown.Item onClick={this.editPost.bind(this)} text={'Edit'}/>
                                                        <Dropdown.Item onClick={this.deletePost.bind(this)} text={'Delete'}/>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                : null
                                            }
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>;

        if (this.state.deleted) {
            return <Redirect to={`/user/${cookies.get('user_id')}/blog`} />
        }

        return this.state.editing ? newPost : headerPost;
    }
}

export default withCookies(BlogHeaderPost);
