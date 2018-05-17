import React, { Component } from 'react';
import { Container, Grid, Header, Icon, Image, Responsive } from 'semantic-ui-react';
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
                <Container >
                    <Grid padded >
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Grid>
                                    <Grid.Row>
                                        <Responsive as={Grid.Column} width={2} minWidth={768} >
                                            <Image circular src={`/api/images/${this.props.user.pictureUrl}`}/>
                                        </Responsive>
                                        <Responsive as={Grid.Column} width={14} minWidth={768} >
                                            <Header as={'h3'}>
                                                {this.props.user.fullName}
                                            </Header>
                                            <Header.Subheader verticalAlign={'top'}>
                                                {this.props.postInfo.datePosted}
                                            </Header.Subheader>
                                        </Responsive>
                                        <Responsive as={Grid.Column} width={4} maxWidth={768} >
                                            <Image circular src={`/api/images/${this.props.user.pictureUrl}`}/>
                                        </Responsive>
                                        <Responsive as={Grid.Column} width={12} maxWidth={768} >
                                            <Header as={'h3'}>
                                                {this.props.user.fullName}
                                            </Header>
                                            <Header.Subheader verticalAlign={'top'}>
                                                {this.props.postInfo.datePosted}
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
            </div>
        );
    }
}

export default BlogHeaderPost;
