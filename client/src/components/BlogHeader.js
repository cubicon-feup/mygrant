import React, { Component } from 'react';
import { Container, Header, Image, Segment } from 'semantic-ui-react';
import { instanceOf } from 'prop-types';

class BlogHeader extends Component {
    static propTypes = { user: instanceOf(Object).isRequired };

    render() {
        return (
            <div className="blog-header">
                <Image centered circular size={'tiny'} src={`/api/images/${this.props.user.pictureUrl}`}/>
                <Segment textAlign={'left'}>
                    <Header as={'h1'}>{this.props.user.fullName}</Header>
                    <Header.Subheader>Chicago, United States of America</Header.Subheader>
                    <Container text>
                </Container>
                </Segment>
            </div>
        )
    }
}

export default BlogHeader;
