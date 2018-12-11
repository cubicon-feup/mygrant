import React, { Component } from 'react';
import '../css/User.css';

import { Container, Header, Divider, Button, Image, Icon, Rating, Modal, Input, TextArea } from 'semantic-ui-react';
import { withCookies } from 'react-cookie';

const urlForUser = id => `/api/users/${id}`;
const urlForRating = id => `/api/users/${id}/rating`;
const urlForFriends = id => `/api/users/${id}/friends`;
const urlForProvides = id => `/api/users/${id}/provides`;
const urlForRequests = id => `/api/users/${id}/requests`;
const urlForCrowdfundings = id => `/api/users/${id}/crowdfundings`;
const urlForAssociations = id => `/api/users/${id}/associations`;
const urlForBlockUser = `/api/users/block_user`;
const urlForFriend = `/api/users/add_friend`;
const urlForFriendRequest = `/api/users/friend_request`;
const urlForDonation = `/api/users/donation`;
const urlForLoan = `/api/users/loan`;
const urlForDonationRequest = `/api/users/donation_request`;
const urlForLoanRequest = `/api/users/loan_request`;
const urlForEditUser = `/api/users`;
const urlForEditImage = `/api/users/image`;
const urlForUserImage = `/users/`;

class HeaderDivider extends Component {
	render() {
		return (
			<div className="mygrant-title">
				<Container>
					<Header size="large">{this.props.title}</Header>
				</Container>
				<div className={`mygrant-divider ${this.props.color}`}>
					<Divider className="title-divider" />
				</div>
			</div>
		);
	}
}

// Props: id, cookies, friend_request_sent, friend_request_received, function_set_modal, function_update_friend
class AddFriendButton extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.sendFriendRequest = this.sendFriendRequest.bind(this);
		this.unsendFriendRequest = this.unsendFriendRequest.bind(this);
		this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
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
			this.props.function_update_friend(true);
		});
	}

	render() {
		if (this.state.friend_request_sent !== undefined ? this.state.friend_request_sent : this.props.friend_request_sent) {
			return (
				<Button className="profile-button friend-button button-green-red"
				onClick={()=>this.props.function_set_modal('Cancel friend request', 'Are you sure you want to cancel the friend request you sent to this user?', this.unsendFriendRequest)}>
					<Icon className="add"/>
				</Button>);
		} else if (this.props.friend_request_received) {
			return (
				<Button className="profile-button friend-button button-green"
				onClick={()=>this.props.function_set_modal('Add friend', 'Are you sure you want to add this user as a friend?', this.acceptFriendRequest)}>
					<Icon className="add"/>
				</Button>);
		} else {
			return (
				<Button className="profile-button friend-button button-purple-green"
				onClick={()=>this.props.function_set_modal('Send friend request', 'Are you sure you want to send a friend request to this user?', this.sendFriendRequest)}>
					<Icon className="add"/>
				</Button>);
		}
	}
}

// Props: id, cookies, function_update_friend, function_set_modal
class RemoveFriendButton extends Component {
	constructor(props) {
		super(props);
		this.removeFriend = this.removeFriend.bind(this);
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
			this.props.function_update_friend(false);
		});
	}

	render() {
		return (
			<Button className="profile-button friend-button button-green-red"
			onClick={()=>this.props.function_set_modal('Remove friend', 'Are you sure you want to remove this user as a friend?', this.removeFriend)}>
				<Icon className="user"/>
			</Button>);
	}
}

// Props: id
class ChatButton extends Component {
	render() {
		return (
			<Button className="profile-button button-green message-button"><a href={"/conversation/"+this.props.id}><Icon className="chat"/></a></Button>
		);
	}
}

// Props: id, cookies, self, function_block_user, function_set_modal
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
				<Button className="profile-button button-red block-button" onClick={()=>this.props.function_set_modal('Block user', 'Are you sure you want to block this user?', this.blockUser)}>
					<Icon className="remove"/>
				</Button>);
		}

		return null;
	}
}

// Props: id, cookies, function_set_modal
class DonationButton extends Component {
	constructor(props) {
		super(props);
		this.makeDonation = this.makeDonation.bind(this);
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

	render() {
		return (
			<Button
				className="profile-button donation-button button-green"
				onClick={()=>this.props.function_set_modal('Make donation', 'Are you sure you want to donate to this user?', this.makeDonation, true)}
			>
				<Icon className="level up"/>
			</Button>
		);
	}
}

// Props: id, cookies, donation_request, function_update_donation_status, function_set_modal
class DonationRequestButton extends Component {
	constructor(props) {
		super(props);
		this.requestDonation = this.requestDonation.bind(this);
		this.cancelDonationRequest = this.cancelDonationRequest.bind(this);
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

	render() {
		let button = this.props.donation_request
			? <Button className="profile-button donation-request-button button-green-red"
				onClick={() => this.props.function_set_modal('Cancel donation request', 'Are you sure you want to cancel the donation request made to this user?', this.cancelDonationRequest)}>
				<Icon className="level down"/>
			</Button>
			: <Button className="profile-button donation-request-button button-purple-green"
				onClick={()=>this.props.function_set_modal('Request donation', 'Are you sure you want request a donation from this user?', this.requestDonation, true)}>
				<Icon className="level down"/>
			</Button>

		return button;
	}
}

// Props: id, cookies, function_set_modal
class LoanButton extends Component {
	constructor(props) {
		super(props);
		this.makeLoan = this.makeLoan.bind(this);
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

	render() {
		return (
			<Button className="profile-button loan-button" onClick={()=>this.props.function_set_modal('Give loan', 'Are you sure you want give this user a loan?', this.makeLoan, true, true)}>
				<Icon className="double angle right"/>
			</Button>
		);
	}
}

// Props: id, cookies, loan_request, function_update_loan_status, function_set_modal
class LoanRequestButton extends Component {
	constructor(props) {
		super(props);
		this.requestLoan = this.requestLoan.bind(this);
		this.cancelLoanRequest = this.cancelLoanRequest.bind(this);
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
		let button = this.props.loan_request
			? <Button className="profile-button loan-request-button button-green-red"
				onClick={()=>this.props.function_set_modal('Cancel loan request', 'Are you sure you want to cancel the loan request made to this user?', this.cancelLoanRequest)}>
					<Icon className="double angle left"/>
				</Button>
			: <Button className="profile-button loan-request-button button-purple-green"
				onClick={()=>this.props.function_set_modal('Request loan', 'Are you sure you want to request a loan from this user?', this.requestLoan, true)}>
					<Icon className="double angle left"/>
				</Button>;

		return button;
	}
}

// Props: function_toggle_input, function_update_image
// State: editing
class SelfMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {editing: false};
		this.updateImage = this.updateImage.bind(this);
	}

	updateImage(file) {
		let reader = new FileReader();
		reader.onload = (e) => {
			this.props.function_update_image(file, e.target.result);

		};
		reader.readAsDataURL(file);
	}

	render () {
		let buttons = this.state.editing
			? <div>
					<Button
						className="profile-button button-green save-button"
						onClick={() => {this.props.function_toggle_input(true); this.state.editing=false;}}
					>
						<Icon className="save"/>
					</Button>
					<Button
						className="profile-button button-green return-button"
						onClick={() => {this.props.function_toggle_input(false); this.state.editing=false;}}
					>
						<Icon className="left arrow"/>
					</Button>
				</div>
			: <div>
					<Button className="profile-button button-green edit-text-button" onClick={() => {this.props.function_toggle_input(); this.state.editing=true;}}>
						<Icon className="pencil"/>
					</Button>
					<Button className="profile-button button-green edit-image-button">
						<label htmlFor="image-input">
							<Icon className="image"/>
						</label>
					</Button>
					<input type="file" id="image-input" accept="image/*" onChange={e => this.updateImage(e.target.files[0])}hidden />
				</div>;

		return (
			<div className="self-menu-buttons">
				{buttons}
			</div>
		);
	}
}

// Props: id, self, cookies, friend_request_sent, friend_request_received, function_block_user, function_set_modal, function_update_friend
class UnknownMenu extends Component {
	render() {
		return (
			<div className="unknown-menu-buttons">
				<AddFriendButton
					id={this.props.id}
					cookies={this.props.cookies}
					friend_request_sent={this.props.friend_request_sent}
					friend_request_received={this.props.friend_request_received}
					function_set_modal={this.props.function_set_modal}
					function_update_friend={this.props.function_update_friend}
				/>

				<ChatButton id={this.props.id}/>

				<BlockButton
					id={this.props.id}
					self={this.props.self}
					cookies={this.props.cookies}
					function_block_user={this.props.function_block_user}
					function_set_modal={this.props.function_set_modal}
				/>
			</div>
		);
	}
}

// id, self, cookies, function_set_modal, function_update_friend, function_block_user, function_update_transaction
class FriendMenu extends Component {
	render() {
		return (
			<div className="friend-menu-buttons">
				<RemoveFriendButton
					id={this.props.id}
					cookies={this.props.cookies}
					function_set_modal={this.props.function_set_modal}
					function_update_friend={this.props.function_update_friend}
				/>

				<Button className="profile-button button-green transaction-button" onClick={() => this.props.function_update_transaction(true)}><Icon className="dollar"/></Button>

				<ChatButton id={this.props.id}/>

				<BlockButton
					id={this.props.id}
					self={this.props.self}
					cookies={this.props.cookies}
					function_block_user={this.props.function_block_user}
					function_set_modal={this.props.function_set_modal}
				/>
			</div>
		);
	}
}

// Props: id, cookies, donation_request, loan_request, function_update_transaction, function_update_donation_status, function_update_loan_status
class TransactionMenu extends Component {
	render() {
		return (
			<div className="transaction-menu-buttons">
				<DonationButton
					id={this.props.id}
					cookies={this.props.cookies}
					function_set_modal={this.props.function_set_modal}
				/>

				<DonationRequestButton
					id={this.props.id}
					cookies={this.props.cookies}
					donation_request={this.props.donation_request}
					function_update_donation_status={this.props.function_update_donation_status}
					function_set_modal={this.props.function_set_modal}
				/>

				<LoanButton
					id={this.props.id}
					cookies={this.props.cookies}
					function_set_modal={this.props.function_set_modal}
				/>

				<LoanRequestButton
					id={this.props.id}
					cookies={this.props.cookies}
					loan_request={this.props.loan_request}
					function_update_loan_status={this.props.function_update_loan_status}
					function_set_modal={this.props.function_set_modal}
				/>

				<Button className="profile-button return-button button-green" onClick={() => this.props.function_update_transaction(false)}><Icon className="left arrow"/></Button>
			</div>
		);
	}
}

class ProfileContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {disable_buttons: false, editing: false, image_url: this.props.photo, friend: this.props.friend, transaction: false};
		this.toggleButtons = this.toggleButtons.bind(this);
		this.toggleInput = this.toggleInput.bind(this);
		this.updateImage = this.updateImage.bind(this);
		this.setModalContent = this.setModalContent.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.updateFriendStatus = this.updateFriendStatus.bind(this);
		this.updateTransaction = this.updateTransaction.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (!this.state.name) {
			this.setState({name: nextProps.name, input_name: nextProps.name});
		}

		if (!this.state.bio) {
			this.setState({bio: nextProps.bio, input_bio: nextProps.bio});
		}

		var url = this.state.image_url;
		if (url.split('/')[url.length-1] === undefined) {
			this.setState({image_url: nextProps.photo});
		}

		if (this.state.friend === undefined) {
			this.setState({friend: nextProps.friend});
		}
	}

	toggleInput(save) {
		if (this.state.editing) {
			if (save) {
				fetch(urlForEditUser,
				{
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${this.props.cookies.get('id_token')}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						name: this.state.input_name,
						bio: this.state.input_bio
					})
				})
				.then(response => {
					if (!response.ok) {
						throw Error('Network request failed');
					}
					this.setState({editing: false, name: this.state.input_name, bio: this.state.input_bio});
				});
			}
			else {
				this.setState({editing: false});
			}
		}
		else {
			this.setState({editing: true});
		}
	}

	updateImage(backend, frontend) {
		let form = new FormData()
		form.append('image', backend);

		fetch(urlForEditImage,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.props.cookies.get('id_token')}`,
			},
			body: form
		})
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
			this.setState({image_url: frontend});
		});
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
		this.setState({ friend: status });
	}

	updateTransaction(status) {
		this.setState({ transaction: status });
	}

	render() {
		let location = (this.props.city !== null ? this.props.city : '') +
						(this.props.city !== null && this.props.country !== null ? ', ' : '') +
						(this.props.country !== null ? this.props.country : '');

		let menu;
		if (this.props.self) {
			menu = <SelfMenu
						function_toggle_input={this.toggleInput}
						function_update_image={this.updateImage}
					/>
		} else if (this.state.transaction) {
			menu = <TransactionMenu
						id={this.props.id}
						cookies={this.props.cookies}
						donation_request={this.props.donation_request}
						loan_request={this.props.loan_request}
						function_set_modal={this.setModalContent}
						function_update_transaction={this.updateTransaction}
						function_update_donation_status={this.props.function_update_donation_status}
						function_update_loan_status={this.props.function_update_loan_status}
					/>
		} else if (this.state.friend) {
			menu = <FriendMenu
						id={this.props.id}
						self={this.props.self}
						cookies={this.props.cookies}
						function_block_user={this.props.function_block_user}
						function_set_modal={this.setModalContent}
						function_update_friend={this.updateFriendStatus}
						function_update_transaction={this.updateTransaction}
					/>
		}
		else if (this.props.authenticated) {
			menu = <UnknownMenu
						id={this.props.id}
						self={this.props.self}
						cookies={this.props.cookies}
						friend_request_sent={this.props.friend_request_sent}
						friend_request_received={this.props.friend_request_received}
						function_block_user={this.props.function_block_user}
						function_set_modal={this.setModalContent}
						function_update_friend={this.updateFriendStatus}
					/>
		} else {
			menu = null;
		}

		return (
			<div>
				<HeaderDivider title="User" color="purple"/>
				<Container>
					<div className="profile-container ui grid centered stackable middle aligned">
						<div className="six wide column profile-photo">
							<div className="image-container">
								<Image circular src={this.state.image_url}/>
								{menu}
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
								{this.state.editing
									? <Input value={this.state.input_name} onChange={(e) => this.setState({input_name: e.target.value})} />
									: <Header className="profile-name" size="large">{this.state.name}</Header>
								}
								<br/>
								<Header className="profile-location" size="medium">{location}</Header>
								<br/>
								{this.props.rating !== undefined &&
									<Rating defaultRating={Math.round(this.props.rating)} maxRating={3} size="large" disabled />
								}
								<br/>
								{this.state.editing
									? <TextArea value={this.state.input_bio} onChange={(e) => this.setState({input_bio: e.target.value})} />
									: <p>{this.state.bio}</p>
								}
							</div>
						</div>
					</div>
				</Container>
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
						} else if (this.props.input) {
							this.props.callback(this.state.amount);
						} else {
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

		return (
			<div>
				<HeaderDivider title={this.props.title} color="purple"/>
				<Container className="extra-container">
					{this.props.content.map((elem, i) =>
						<div className="center aligned">
							<a href={this.props.url + elem.id}>
								<Image circular src={this.props.image_directory + elem.image_url}/>
								<div>{elem.name}</div>
							</a>
						</div>
					)}
				</Container>
			</div>
		);
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
		let init;
		if (cookies.get('id_token')) {
			init = {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${cookies.get('id_token')}`
				}
			};
		} else {
			init = { method: 'GET' };
		}

        fetch(urlForUser(this.state.id), init)
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
			return response;
		})
		.then(result => result.json())
		.then(
			result => this.setState(result),
			() => console.log('ERROR')
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
			result => this.setState(result),
			() => console.log('ERROR')
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
			result => this.setState({friends: result}),
			() => console.log('ERROR')
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
			result => this.setState({provides: result}),
			() => console.log('ERROR')
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
			result => this.setState({requests: result}),
			() => console.log('ERROR')
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
			result => this.setState({crowdfundings: result}),
			() => console.log('ERROR')
		);

		// Associations
		fetch(urlForAssociations(this.state.id))
		.then(response => {
			if (!response.ok) {
				throw Error('Network request failed');
			}
		
			return response;
		})
		.then(result => result.json())
		.then(
			result => this.setState({associations: result}),
			() => console.log('ERROR'),
			console.log(this.state.associations)
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
				<Container fluid className="main-container">
					<ProfileContainer
						id={this.state.id}
						name={this.state.full_name}
						city={this.state.city}
						country={this.state.country}
						high_level={this.state.high_level}
						bio={this.state.bio}
						photo={urlForUserImage + this.state.image_url}
						rating={this.state.rating}

						authenticated={this.state.authenticated}
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
						title="My Associations"
						content={this.state.associations}
						url="/association/"
					/>

					<ExtrasContainer
						title="Friends"
						content={this.state.friends}
						url="/user/"
						image_directory={urlForUserImage}
					/>
				</Container>
			);
		}
    }
}

export default withCookies(User);
