import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Header, Icon, Image, Responsive } from 'semantic-ui-react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import moment from 'moment';

class BlogHeaderPost extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
        postInfo: instanceOf(Object).isRequired,
        user: instanceOf(Object).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            liked: Boolean(parseInt(this.props.postInfo.liked,10)),
            nLikes: parseInt(this.props.postInfo.likes, 10)
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

    render () {
        return (
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
                                            <h3>{this.props.postInfo.content}</h3>
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
                                            <Icon className={'post-options'} name={'ellipsis horizontal'}/>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default withCookies(BlogHeaderPost);
