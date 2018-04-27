import React, { Component } from 'react';
import '../css/App.css';
import { Container, Header, Table, Modal } from 'semantic-ui-react';
import Service from './Service';

const urlForData = 'http://localhost:3001/api/services';

class TableHeader extends React.Component {
    render() {
        return (
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                    <Table.HeaderCell>Category</Table.HeaderCell>
                    <Table.HeaderCell>Location</Table.HeaderCell>
                    <Table.HeaderCell>Acceptable Radius</Table.HeaderCell>
                    <Table.HeaderCell>MyGrant Value</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        );
    }
}

class TableRow extends React.Component {
    render() {
        return (
            <Table.Row>
                <Modal
                    className="modal-container"
                    trigger={<Table.Cell>{this.props.obj.title}</Table.Cell>}
                >
                    <Service id={this.props.obj.id} />
                </Modal>
                <Table.Cell>{this.props.obj.category}</Table.Cell>
                <Table.Cell>{this.props.obj.location}</Table.Cell>
                <Table.Cell>{this.props.obj.acceptable_radius}</Table.Cell>
                <Table.Cell>{this.props.obj.mygrant_value}</Table.Cell>
                <Table.Cell>{this.props.obj.service_type}</Table.Cell>
            </Table.Row>
        );
    }
}

class TableServices extends Component {
    constructor(props) {
        super(props);
        this.state = { services: [] };
    }

    componentDidMount() {
        fetch(urlForData)
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({ services: result });
                },
                () => {
                    console.log('ERROR');
                }
            );
    }

    render() {
        var tableRows = this.state.services.map(service =>
            <TableRow obj={service} />
        );

        return (
            <Container className="main-container">
                <div>
                    <Header as="h1">Services</Header>
                    <Table celled selectable>
                        <TableHeader />
                        <Table.Body>{tableRows}</Table.Body>
                    </Table>
                </div>
            </Container>
        );
    }
}

export default TableServices;
