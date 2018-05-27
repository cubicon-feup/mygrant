import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Dropdown, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import NewPost from '../components/NewPost';
import moment from 'moment';

class BlogComment extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        postInfo: instanceOf(Object).isRequired,
        user: instanceOf(Object).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
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
                    window.location.reload();
                }
            });
    }

    render () {

        const { cookies } = this.props;
        const canEdit = parseInt(cookies.get('user_id'), 10) === parseInt(this.props.user.id, 10);

        const commentElement =
            <div>
                <Segment className={'blog-post post-comment'} >
                <Container >
                    <Grid padded >
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column width={10}>
                                            <Link to={`/user/${this.props.user.id}/blog`} >
                                                <Header as={'h4'}>
                                                    {
                                                        this.props.user.pictureUrl
                                                            ? <Image size={'tiny'} centered avatar src={`/api/images/${this.props.user.pictureUrl}`}/>
                                                            : <Icon name="user circle outline" color={'black'} size={'big'} />
                                                    }
                                                    {this.props.user.fullName}
                                                </Header>
                                            </Link>
                                            <span className={'comment-date'}>
                                                {moment(this.props.postInfo.datePosted).fromNow()}
                                                {
                                                    canEdit
                                                    ? <Dropdown icon={'ellipsis horizontal'} className={'post-options'} >
                                                        <Dropdown.Menu >
                                                            <Dropdown.Item text={'Edit'} onClick={this.editPost.bind(this)} />
                                                            <Dropdown.Item text={'Delete'} onClick={this.deletePost.bind(this)} />
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                    : null
                                                }
                                            </span>
                                        </Grid.Column>
                                        <Grid.Column width={6} textAlign={'right'} >
                                            <span className={'post-likes'} onClick={this.handleLike.bind(this)}>
                                                {
                                                    this.state.liked
                                                    ? <Icon className={'post-likes-icon'} color={'red'} name={'like'}/>
                                                    : <Icon className={'post-likes-icon'} name={'like outline'}/>
                                                }
                                                {this.state.nLikes}
                                            </span>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row className={'content'} verticalAlign={'top'} >
                                        <Grid.Column width={16} >
                                            {this.state.postContent}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
        </div>;

        const newPost = <NewPost onCancel={this.cancelEditing.bind(this)} handleClick={this.completeEditing.bind(this)} />;

        return this.state.editing ? newPost : commentElement;
    }
}

export default withCookies(BlogComment);
