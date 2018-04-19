import React, { Component } from 'react';
import '../css/App.css';
import { Link } from 'react-router-dom';
import { Container, Header, Table, Modal } from 'semantic-ui-react';
import Service from './Service';

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
        this.state = {
            services: [
                {
                    id: 0,
                    title: 'Cortar a relva',
                    category: 'Jardim',
                    location: 'Aldoar',
                    acceptable_radius: '5km',
                    mygrant_value: '5',
                    service_type: 'PROVIDE'
                },
                {
                    id: 1,
                    title: 'Explicações de Sistemas Operativos',
                    category: 'Educação',
                    location: 'Paranhos',
                    acceptable_radius: '60km',
                    mygrant_value: '60',
                    service_type: 'PROVIDE'
                }
            ]
        };
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
