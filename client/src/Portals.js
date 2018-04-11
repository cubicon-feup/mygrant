import React from "react";
import ReactDOM from "react-dom";

const modal = document.getElementById("modal");

class Valor {
	toString() {
		return "123";
	}
}

class Modal extends React.Component {
	constructor(props) {
		super(props);
		this.element = document.createElement("div");
	}

	componentDidMount() {
		modal.appendChild(this.element);
	}

	componentWillUnmount() {
		modal.removeChild(this.element);
	}

	render() {
		return ReactDOM.createPortal(this.props.children, this.element);
	}
}

class Portal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {showModal: false};
		this.valor = new Valor();
		this.mostraModal = this.mostraModal.bind(this);
		this.escondeModal = this.escondeModal.bind(this);
	}

	mostraModal() {
		this.setState({showModal: true});
	}

	escondeModal() {
		this.setState({showModal: false});
	}

	render() {
		const modal = this.state.showModal ? (
			<Modal>
				<div atributo={this.valor} className="App">
					<div>É a moda do pisca pisca</div>
					<button onClick={this.escondeModal}>Hide modal</button>
				</div>
			</Modal>
		) : null;

		return (
			<div>
				<button onClick={this.mostraModal}>Show modal</button>
				{modal}
			</div>
		);
	}
}

export default Portal;
