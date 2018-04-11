import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			errorInfo: null
		};
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo
		});
	}

	render() {
		if (this.state.errorInfo) {
			return (
				<div>
					<h2>Something went wrong.</h2>
					<details style={{whiteSpace: "pre-wrap"}}>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo.componentStack}
					</details>
				</div>
			);
		} else {

		return this.props.children;
	}
	}
}

class Usuario extends React.Component {
	render() {
		return <div>{this.props.user.nome}</div>;
	}
}

class ErrorBoundaries extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {
				nome: "Diogo Cruz"
			}
		};
	}

	throwError = () => {
		this.setState({user: null});
	}

	render() {
		return (
			<div>
				<ErrorBoundary>
					<Usuario user={this.state.user} />
					<button onClick={this.throwError}>
						Change Name
					</button>
				</ErrorBoundary>
			</div>
		);
	}
}

export default ErrorBoundaries;
