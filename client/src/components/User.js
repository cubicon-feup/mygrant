import React, { Component } from 'react';
import '../css/User.css';

import { Container, Header, Divider, Button, Image, Icon, Rating } from 'semantic-ui-react';

const urlForUser = id => `http://localhost:3001/api/users/${id}`;
const urlForFriends = id => `http://localhost:3001/api/users/${id}/friends`;
const urlForProvides = id => `http://localhost:3001/api/users/${id}/provides`;
const urlForRequests = id => `http://localhost:3001/api/users/${id}/requests`;
const urlForCrowdfundings = id => `http://localhost:3001/api/users/${id}/crowdfundings`;

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
			<div>
				<HeaderDivider title="User" color="purple"/>
				<div className="profile-container ui grid centered stackable middle aligned">
					<div className="six wide column profile-photo">
						<div className="image-container">
							<Image circular src={this.props.photo}/>
							<Button className="edit-button">
								<Icon className="pencil"/>
							</Button>
						</div>
					</div>
					<div id="profile-info" className="ten wide column">
						<div className="profile-info-wrapper">
							<Header className="profile-name" size="large">{this.props.name}</Header><br/>
							<Header className="profile-location" size="medium">{location}</Header><br/>
							<Rating defaultRating={2} maxRating={3} size="large" disabled /><br/>
							<p>{this.props.bio}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class ExtrasContainer extends Component {
	render() {
		if (this.props.content === undefined || this.props.content.length === 0) {
			return null;
		}
		else {
			return (
				<div>
					<HeaderDivider title={this.props.title} color="purple"/>
					<div className="extra-container">
						{this.props.content.map((elem, i) => {
							return (
								<div className="center aligned">
									<a href={this.props.url+elem.id}>
										<Image circular src={elem.image_url}/>
										<div>{elem.name}</div>
									</a>
								</div>
							);
						})}
					</div>
				</div>
			);
		}
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
		// User info
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
		
		// Friends
		fetch(urlForFriends(this.state.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({friends: result});
                },
                () => {
                    console.log('ERROR');
                }
            );
			
		// Service Provides
		fetch(urlForProvides(this.state.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({provides: result});
                },
                () => {
                    console.log('ERROR');
                }
            );
			
		// Service Provides
		fetch(urlForRequests(this.state.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({requests: result});
                },
                () => {
                    console.log('ERROR');
                }
            );
			
		// Crowdfundings
		fetch(urlForCrowdfundings(this.state.id))
            .then(response => {
                if (!response.ok) {
                    throw Error('Network request failed');
                }

                return response;
            })
            .then(result => result.json())
            .then(
                result => {
                    this.setState({crowdfundings: result});
                },
                () => {
                    console.log('ERROR');
                }
            );
		
    }

    render() {		
        return (
            <Container className="main-container">
				<ProfileContainer
					name={this.state.full_name}
					city={this.state.city}
					country={this.state.country}
					high_level={this.state.high_level}
					bio={this.state.bio}
					photo={this.state.image_url}
				/>
				
				<ExtrasContainer
					title="My Services"
					content={this.state.provides}
					url="/service/"
				/>
				
				<ExtrasContainer
					title="My Needs"
					content={this.state.requests}
					url="/service/"
				/>
				
				<ExtrasContainer
					title="My Crowdfundings"
					content={this.state.crowdfundings}
					url="/crowdfunding/"
				/>
				
				<ExtrasContainer
					title="Friends"
					content={this.state.friends}
					url="/user/"
				/>
            </Container>
        );
    }
}

export default User;
