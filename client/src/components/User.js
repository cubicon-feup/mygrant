import React, { Component } from 'react';
import '../css/User.css';

import { Container, Header, Divider, Button, Image, Icon, Rating, Modal, Input } from 'semantic-ui-react';
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
const urlForDonation = `http://localhost:3001/api/users/donation`;
const urlForLoan = `http://localhost:3001/api/users/loan`;
const urlForDonationRequest = `http://localhost:3001/api/users/donation_request`;
const urlForLoanRequest = `http://localhost:3001/api/users/loan_request`;

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
			this.props.function_update_friend(false);
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
			this.props.function_update_friend(true);
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
				<Button className="profile-button remove-friend-button"
				onClick={()=>this.props.function_set_modal('Remove friend', 'Are you sure you want to remove this user as a friend?', this.removeFriend)}>
					<Icon className="user"/>
				</Button>);
		}
		// Unsend friend request button
		else if (this.state.friend_request_sent !== undefined ? this.state.friend_request_sent : this.props.friend_request_sent) {
			return (
				<Button className="profile-button send-friend-request-button sent"
				onClick={()=>this.props.function_set_modal('Cancel friend request', 'Are you sure you want to cancel the friend request you sent to this user?', this.unsendFriendRequest)}>
					<Icon className="add"/>
				</Button>);
		}
		// Accept friend request button
		else if (this.props.friend_request_received) {
			return (
				<Button className="profile-button accept-friend-request-button"
				onClick={()=>this.props.function_set_modal('Add friend', 'Are you sure you want to add this user as a friend?', this.acceptFriendRequest)}>
					<Icon className="add"/>
				</Button>);
		}
		// Send friend request button
		else {
			return (
				<Button className="profile-button send-friend-request-button notsent"
				onClick={()=>this.props.function_set_modal('Send friend request', 'Are you sure you want to send a friend request to this user?', this.sendFriendRequest)}>
					<Icon className="add"/>
				</Button>);
		}
	}
	
}

class TransactionButton extends Component {
	constructor(props) {
		super(props);
		this.state = {showTransactions: false};
		this.toggleTransactionButtons = this.toggleTransactionButtons.bind(this);
		this.makeDonation = this.makeDonation.bind(this);
		this.requestDonation = this.requestDonation.bind(this);
		this.cancelDonationRequest = this.cancelDonationRequest.bind(this);
		this.makeLoan = this.makeLoan.bind(this);
		this.requestLoan = this.requestLoan.bind(this);
		this.cancelLoanRequest = this.cancelLoanRequest.bind(this);
	}
	
	toggleTransactionButtons() {
		this.props.function_toggle_buttons();
		this.setState({showTransactions: !this.state.showTransactions});
	}
	
	makeDonation(amount) {
		fetch(urlForDonation, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.props.cookies.get('id_token')}`
			},
			body: JSON.stringify({
				user_id: this.props.id,
				amount: amount
			})
		})
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
		});
	}
	
	requestDonation(amount) {
		fetch(urlForDonationRequest, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.props.cookies.get('id_token')}`
			},
			body: JSON.stringify({
				user_id: this.props.id,
				amount: amount
			})
		})
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
			this.props.function_update_donation_status(true);
		});
	}
	
	cancelDonationRequest() {
		fetch(urlForDonationRequest, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.props.cookies.get('id_token')}`
			},
			body: JSON.stringify({
				user_id: this.props.id,
			})
		})
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
			this.props.function_update_donation_status(false);
		});
	}
	
	makeLoan(amount, date) {
		fetch(urlForLoan, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.props.cookies.get('id_token')}`
			},
			body: JSON.stringify({
				user_id: this.props.id,
				amount: amount,
				date_max_repay: date
			})
		})
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
		});
	}
	
	requestLoan(amount) {
		fetch(urlForLoanRequest, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.props.cookies.get('id_token')}`
			},
			body: JSON.stringify({
				user_id: this.props.id,
				amount: amount
			})
		})
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
			this.props.function_update_loan_status(true);
		});
	}
	
	cancelLoanRequest() {
		fetch(urlForLoanRequest, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.props.cookies.get('id_token')}`
			},
			body: JSON.stringify({
				user_id: this.props.id,
			})
		})
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
			this.props.function_update_loan_status(false);
		});
	}
	
	render() {
		if (!this.props.self && this.props.friend) {
			if (this.state.showTransactions) {
				return (
					<div>
						<Button className="profile-button return-button"
						onClick={this.toggleTransactionButtons}>
							<Icon className="left arrow"/>
						</Button>
					
						<Button className="profile-button donation-button"
						onClick={()=>this.props.function_set_modal('Make donation', 'Are you sure you want to donate to this user?', this.makeDonation, true)}>
							<Icon className="level up"/>
						</Button>
						
						{!this.props.donation_request &&
							<Button className="profile-button donation-request-button"
							onClick={()=>this.props.function_set_modal('Request donation', 'Are you sure you want request a donation from this user?', this.requestDonation, true)}>
								<Icon className="level down"/>
							</Button>}
							
						{this.props.donation_request &&
							<Button className="profile-button donation-request-cancel-button"
							onClick={()=>this.props.function_set_modal('Cancel donation request', 'Are you sure you want to cancel the donation request made to this user?', this.cancelDonationRequest)}>
								<Icon className="level down"/>
							</Button>}
						
						<Button className="profile-button loan-button"
						onClick={()=>this.props.function_set_modal('Give loan', 'Are you sure you want give this user a loan?', this.makeLoan, true, true)}>
							<Icon className="double angle right"/>
						</Button>
						
						{!this.props.loan_request &&
							<Button className="profile-button loan-request-button"
							onClick={()=>this.props.function_set_modal('Request loan', 'Are you sure you want to request a loan from this user?', this.requestLoan, true)}>
								<Icon className="double angle left"/>
							</Button>
						}
						
						{this.props.loan_request &&
							<Button className="profile-button loan-request-cancel-button"
							onClick={()=>this.props.function_set_modal('Cancel loan request', 'Are you sure you want to cancel the loan request made to this user?', this.cancelLoanRequest)}>
								<Icon className="level down"/>
							</Button>}
					</div>
				);
			}
			else {
				return (
					<Button className="profile-button transaction-button" onClick={this.toggleTransactionButtons}>
						<Icon className="dollar"/>
					</Button>);
			}
		}		
		else {
			return null;
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
				<Button className="profile-button block-button" onClick={()=>this.props.function_set_modal('Block user', 'Are you sure you want to block this user?', this.blockUser)}>
					<Icon className="remove"/>
				</Button>);
		}
		else {
			return null;
		}
	}
}

class ProfileContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {disable_buttons: false};
		this.toggleButtons = this.toggleButtons.bind(this);
		this.setModalContent = this.setModalContent.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.updateFriendStatus = this.updateFriendStatus.bind(this);
	}
	
	toggleButtons() {
		this.setState({disable_buttons: !this.state.disable_buttons});
	}
	
	setModalContent(header, content, callback, has_input, has_date) {
		this.setState({
			modal_header: header,
			modal_content: content,
			modal_callback: callback,
			modal_open: true,
			modal_input: has_input,
			modal_input_date: has_date
		});
	}
	
	closeModal() {
		this.setState({
			modal_open: false
		});
	}

	updateFriendStatus(status) {
		this.setState({
			friend: status
		});
	}
	
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
							{!this.state.disable_buttons &&
								<SocialButton
									id={this.props.id}
									self={this.props.self}
									friend={this.state.friend !== undefined ? this.state.friend : this.props.friend}
									friend_request_sent={this.props.friend_request_sent}
									friend_request_received={this.props.friend_request_received}
									cookies={this.props.cookies}
									function_set_modal={this.setModalContent}
									function_update_friend={this.updateFriendStatus}
								/>
							}

							<TransactionButton
								id={this.props.id}
								self={this.props.self}
								friend={this.state.friend !== undefined ? this.state.friend : this.props.friend}
								donation_request={this.props.donation_request}
								loan_request={this.props.loan_request}
								cookies={this.props.cookies}
								
								function_toggle_buttons={this.toggleButtons}
								function_set_modal={this.setModalContent}
								function_update_donation_status={this.props.function_update_donation_status}
								function_update_loan_status={this.props.function_update_loan_status}
							/>
							
							{!this.state.disable_buttons &&
								<BlockButton
									id={this.props.id}
									self={this.props.self}
									cookies={this.props.cookies}
									function_block_user={this.props.function_block_user}
									function_set_modal={this.setModalContent}
								/>
							}
							
							<ModalContainer 
								header={this.state.modal_header}
								content={this.state.modal_content}
								callback={this.state.modal_callback}
								open={this.state.modal_open}
								input={this.state.modal_input}
								date={this.state.modal_input_date}
								function_close_modal={this.closeModal}
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

class ModalContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}
	
	updateAmount = (e) => {
		this.setState({
			amount: e.target.value
		});
	}
	
	updateDate = (e) => {
		this.setState({
			date: e.target.value
		});
	}
	
	render() {
		return (
			<Modal size="tiny" open={this.props.open} onClose={this.props.function_close_modal}>
				<Modal.Header>{this.props.header}</Modal.Header>
				<Modal.Content>
					{this.props.content}
					{this.props.input &&
						<Input placeholder="Amount..." onChange={this.updateAmount}/>}
					{this.props.date &&
						<Input type="date" onChange={this.updateDate}/>}
				</Modal.Content>
				<Modal.Actions>
					<Button negative content="No" onClick={this.props.function_close_modal}/>
					<Button positive icon="checkmark" labelPosition="right" content="Yes" onClick={()=>{
						if (this.props.input && this.props.date) {
							this.props.callback(this.state.amount, this.state.date);
						}
						else if (this.props.input) {
							this.props.callback(this.state.amount);
						}
						else {
							this.props.callback();
						}
						this.props.function_close_modal();
					}}/>
				</Modal.Actions>
			</Modal>);
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
        this.state = {id: this.getID()};
		this.blockUser = this.blockUser.bind(this);
		this.updateDonationStatus = this.updateDonationStatus.bind(this);
		this.updateLoanStatus = this.updateLoanStatus.bind(this);
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
	
	updateDonationStatus(status) {
		this.setState({donation_request: status});
	}
	
	updateLoanStatus(status) {
		this.setState({loan_request: status});
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
						donation_request={this.state.donation_request}
						loan_request={this.state.loan_request}
						
						cookies={cookies}
						function_update_donation_status={this.updateDonationStatus}
						function_update_loan_status={this.updateLoanStatus}
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
