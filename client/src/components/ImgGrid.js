import React, { Component } from 'react';
import '../css/Service.css';

import { Container, Grid, Image, Loader, Segment } from 'semantic-ui-react';

const urlForImages = id => `/api/services/${id}/images`;

class ImgGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.idService,
            images: {},
            isFetching: true
        };
    }

    componentDidMount() {
        fetch(urlForImages(this.state.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({
                        images: result,
                        isFetching: false
                    });
                },
                () => {
                    console.log('ERROR', 'Failed to fetch images of services.');
                }
            );
    }

    setImgGridSize() {
        if (this.state.images.length < 4) {
            return this.state.images.length;
        } else if (this.state.images.length === 4) {
            return 2;
        } else if (this.state.images.length > 4) {
            return 3;
        }

        return 'ERROR';
    }

    renderImgGrid() {
        var gridlength = this.setImgGridSize();

        if (gridlength > 0 && gridlength < 4) {
            return (
                <Grid className="img" columns={gridlength}>
                    <Grid.Row>
                        {this.state.images.map((img, index) =>
                            <Grid.Column key={index}>
                                <Image src={img.image_url} />
                            </Grid.Column>
                        )}
                    </Grid.Row>
                </Grid>
            );
        } else if (gridlength === 4) {
            return (
                <Grid className="img" columns={gridlength}>
                    <Grid.Row>
                        {this.state.images.slice(0, 1).map(img =>
                            <Grid.Column>
                                <Image src={img.filename} />
                            </Grid.Column>
                        )}
                    </Grid.Row>
                    <Grid.Row>
                        {this.state.images.slice(2, 3).map(img =>
                            <Grid.Column>
                                <Image src={img.filename} />
                            </Grid.Column>
                        )}
                    </Grid.Row>
                </Grid>
            );
        } else if (gridlength > 4 && gridlength < 7) {
            return (
                <Grid className="img" columns={gridlength}>
                    <Grid.Row>
                        {this.state.images.slice(0, 2).map(img =>
                            <Grid.Column>
                                <Image src={img.filename} />
                            </Grid.Column>
                        )}
                    </Grid.Row>
                    <Grid.Row>
                        {this.state.images.slice(3, 5).map(img =>
                            <Grid.Column>
                                <Image src={img.filename} />
                            </Grid.Column>
                        )}
                    </Grid.Row>
                </Grid>
            );
        } else if (gridlength > 6) {
            return (
                <Grid className="img" columns={gridlength}>
                    <Grid.Row>
                        {this.state.images.slice(0, 2).map(img =>
                            <Grid.Column>
                                <Image src={img.filename} />
                            </Grid.Column>
                        )}
                    </Grid.Row>
                    <Grid.Row>
                        {this.state.images.slice(3, 5).map(img =>
                            <Grid.Column>
                                <Image src={img.filename} />
                            </Grid.Column>
                        )}
                    </Grid.Row>
                    <Grid.Row>
                        {this.state.images.slice(6, 8).map(img =>
                            <Grid.Column>
                                <Image src={img.filename} />
                            </Grid.Column>
                        )}
                    </Grid.Row>
                </Grid>
            );
        }

        return <Segment>No Image Available</Segment>;
    }

    render() {
        if (this.state.isFetching) {
            return (
                <Container className="main-container">
                    <Loader active inline="centered" />
                </Container>
            );
        }

        return this.renderImgGrid();
    }
}

export default ImgGrid;
