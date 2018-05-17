import React, { Component } from 'react';
import '../css/User.css';

import { Container, Header, Divider, Button, Image, Icon, Rating } from 'semantic-ui-react';

const urlForUser = id => `http://localhost:3001/api/users/${id}`;

class HeaderDivider extends Component {	
	render() {
		return (
			<div className="mygrant-title">
				<Header size="large">{this.props.title}</Header>
				<div className={`mygrant-divider ${this.props.color}`}>
					<Divider className="title-divider" />
				</div>
			</div>	
		);
	}
}

class ProfileContainer extends Component {
	render() {
		let location = (this.props.city !== null ? this.props.city : '') +
						(this.props.city !== null && this.props.country !== null ? ', ' : '') +
						(this.props.country !== null ? this.props.country : '');
		
		return (
			<div className="profile-container ui grid centered stackable middle aligned">
				<div className="five wide column profile-photo">
					<div className="image-container">
						<Image circular src={this.props.photo}/>
						<Button className="edit-button">
							<Icon className="pencil"/>
						</Button>
					</div>
				</div>
				<div id="profile-info" className="eleven wide column">
					<Header className="profile-name" size="large">{this.props.name}</Header>
					<Header className="profile-location" size="medium">{location}</Header>
					<Rating defaultRating={2} maxRating={3} size="large" disabled />
					<p>{this.props.bio}</p>
				</div>
			</div>
		);
	}
}

class User extends Component {
    constructor(props) {
        super(props);
        this.state = { id: this.getID() };
    }

    getID() {
        return this.props.id ? this.props.id : this.props.match.params.id;
    }

    componentDidMount() {
        fetch(urlForUser(this.state.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState(result);
                },
                () => {
                    console.log('ERROR');
                }
            );
    }

    render() {
        return (
            <Container className="main-container">
                <HeaderDivider title="User" color="purple"/>
				<ProfileContainer
					name={this.state.full_name}
					city={this.state.city}
					country={this.state.country}
					high_level={this.state.high_level}
					bio={this.state.bio}
					photo={this.state.image_url}
				/>
            </Container>
        );
    }
}

export default User;
