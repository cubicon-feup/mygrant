import React, { Component } from 'react';
import '../css/User.css';

import { Container, Header, Divider, Button, Image, Icon, Rating } from 'semantic-ui-react';
import { withCookies, Cookies } from 'react-cookie';

const urlForUser = id => `http://localhost:3001/api/users/${id}`;
const urlForRating = id => `http://localhost:3001/api/users/${id}/rating`;
const urlForFriends = id => `http://localhost:3001/api/users/${id}/friends`;
const urlForProvides = id => `http://localhost:3001/api/users/${id}/provides`;
const urlForRequests = id => `http://localhost:3001/api/users/${id}/requests`;
const urlForCrowdfundings = id => `http://localhost:3001/api/users/${id}/crowdfundings`;
const urlForBlockUser = `http://localhost:3001/api/users/block_user`;
const urlForFriend = `http://localhost:3001/api/users/add_friend`;
const urlForFriendRequest = `http://localhost:3001/api/users/friend_request`;

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

class SocialButton extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.removeFriend = this.removeFriend.bind(this);
		this.sendFriendRequest = this.sendFriendRequest.bind(this);
		this.unsendFriendRequest = this.unsendFriendRequest.bind(this);
		this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
	}
		
	removeFriend() {
		fetch(urlForFriend, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.props.cookies.get('id_token')}`
			},
			body: JSON.stringify({
				id: this.props.id
			})
		})
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
			this.setState({friend: false});
		});
	}
	
	sendFriendRequest() {
		fetch(urlForFriendRequest, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.props.cookies.get('id_token')}`
			},
			body: JSON.stringify({
				id: this.props.id
			})
		})
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
			this.setState({friend_request_sent: true});
		});
	}
	
	unsendFriendRequest() {
		fetch(urlForFriendRequest, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.props.cookies.get('id_token')}`
			},
			body: JSON.stringify({
				id: this.props.id
			})
		})
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
			this.setState({friend_request_sent: false});
		});
	}
	
	acceptFriendRequest() {
		fetch(urlForFriend, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.props.cookies.get('id_token')}`
			},
			body: JSON.stringify({
				id: this.props.id
			})
		})
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
			this.setState({friend: true});
		});
	}
	
	render() {
		// Edit button
		if (this.props.self) {
			return (
				<Button className="profile-button edit-button">
					<Icon className="pencil"/>
				</Button>);
				
		}
		// Remove friend button
		else if (this.state.friend !== undefined ? this.state.friend : this.props.friend) {
			return (
				<Button className="profile-button remove-friend-button" onClick={this.removeFriend}>
					<Icon className="user"/>
				</Button>);
		}
		// Unsend friend request button
		else if (this.state.friend_request_sent !== undefined ? this.state.friend_request_sent : this.props.friend_request_sent) {
			return (
				<Button className="profile-button send-friend-request-button sent" onClick={this.unsendFriendRequest}>
					<Icon className="add"/>
				</Button>);
		}
		// Accept friend request button
		else if (this.props.friend_request_received) {
			return (
				<Button className="profile-button accept-friend-request-button" onClick={this.acceptFriendRequest}>
					<Icon className="add"/>
				</Button>);
		}
		// Send friend request button
		else {
			return (
				<Button className="profile-button send-friend-request-button notsent" onClick={this.sendFriendRequest}>
					<Icon className="add"/>
				</Button>);
		}
	}
	
}

class BlockButton extends Component {
	constructor(props) {
		super(props);
		this.blockUser = this.blockUser.bind(this);
	}
	
	blockUser() {
		fetch(urlForBlockUser, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.props.cookies.get('id_token')}`
			},
			body: JSON.stringify({
				id: this.props.id
			})
		})
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
			this.props.function_block_user();
		});
	}
	
	render() {
		if (!this.props.self) {
			return (
				<Button className="profile-button block-button" onClick={this.blockUser}>
					<Icon className="remove"/>
				</Button>);
		}
		else {
			return null;
		}
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
							<SocialButton
								id={this.props.id}
								self={this.props.self}
								friend={this.props.friend}
								friend_request_sent={this.props.friend_request_sent}
								friend_request_received={this.props.friend_request_received}
								cookies={this.props.cookies}
							/>
							
							<BlockButton
								id={this.props.id}
								self={this.props.self}
								cookies={this.props.cookies}
								function_block_user={this.props.function_block_user}
							/>
						</div>
					</div>
					<div id="profile-info" className="ten wide column">
						<div className="profile-info-wrapper">
							<Header className="profile-name" size="large">{this.props.name}</Header><br/>
							<Header className="profile-location" size="medium">{location}</Header><br/>
							{this.props.rating !== undefined &&
								<Rating defaultRating={Math.round(this.props.rating)} maxRating={3} size="large" disabled />
							}<br/>
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
		this.blockUser = this.blockUser.bind(this);
    }

    getID() {
        return this.props.id ? this.props.id : this.props.match.params.id;
    }

    componentDidMount() {
		const { cookies } = this.props;
		
		// User info
        fetch(urlForUser(this.state.id), {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${cookies.get('id_token')}`
			}
		})
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
		
		// Rating
		fetch(urlForRating(this.state.id))
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
	
	blockUser() {
		this.setState({blocked: true});
	}
	
    render() {
		const { cookies } = this.props;
		if (this.state.blocked) {
			return (
				<Container className="main-container">
					<p>This user does not exit</p>
				</Container>
			)
		}
		else {
			return (
				<Container className="main-container">
					<ProfileContainer
						id={this.state.id}
						name={this.state.full_name}
						city={this.state.city}
						country={this.state.country}
						high_level={this.state.high_level}
						bio={this.state.bio}
						photo={this.state.image_url}
						rating={this.state.rating}
						
						self={this.state.self}
						friend={this.state.friend}
						friend_request_sent={this.state.friend_request_sent}
						friend_request_received={this.state.friend_request_received}
						
						cookies={cookies}
						function_block_user={this.blockUser}
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
						title="My Missions"
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
}

export default withCookies(User);
