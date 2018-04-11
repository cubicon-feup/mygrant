import React, {Component} from "react";
import logo from "./logo.svg";
import "./App.css";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import ErrorBoundaries from "./ErrorBoundaries.js";
import Fragments from "./Fragments.js";
import Portal from "./Portals.js";

class Head extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
				</header>{" "}
			</div>
		);
	}
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			qty: 0
		};
	}

	render() {
		return (
			<div className="App">
				<header>
					<h1 className="App-title">{this.props.name}</h1>{" "}
				</header>{" "}
				<h3>Qty: {this.state.qty}</h3>
				<button onClick={() => this.buy()}>Buy</button>
				<button onClick={() => this.show()}>Show</button>
			</div>
		);
	}

	buy() {
		this.setState({
			qty: this.state.qty + 1
		});
		this.props.handleTotal();
	}

	show() {
		this.props.handleShow(this.props.name);
	}
}

class Total extends Component {
	render() {
		return <h3 className="App">Total Stuff Bought: {this.props.total}</h3>;
	}
}

class AppForm extends Component {
	submit(e) {
		e.preventDefault();
		this.props.handleCreate(this.refs.name.value);
		this.refs.name.value = "";
	}

	render() {
		return (
			<form onSubmit={e => this.submit(e)} className="App">
				<input type="text" placeholder="App Name" ref="name" />
				<br />
				<button>Create MyAPP</button>
				<hr />
			</form>
		);
	}
}

class GetFromExpress extends Component {
	constructor(props) {
		super(props);
		this.state = {info: []};
	}

	componentDidMount() {
		fetch("/api/app_info")
			.then(res => res.json())
			.then(info => this.setState({info}));
	}

	render() {
		return [
			<p>
				{this.state.info.appName} {"developed for "}
				{this.state.info.client} {"by "}
				{this.state.info.company}
			</p>
		];
	}
}

class ListOfFrameworks extends Component {
	constructor(props) {
		super(props);
		this.state = {
			total: 0,
			applist: ["Node", "Express", "React", "Redux", "Jest"]
		};
	}

	showName(name) {
		alert("You selected " + name);
	}

	createAPP(newapp) {
		this.setState({applist: this.state.applist.concat(newapp)});
	}

	calculateTotal() {
		this.setState({
			total: this.state.total + 1
		});
	}

	gotoErrorBoundaries() {
		window.location = "/ErrorBoundaries.js";
	}

	componentDidMount() {
		console.log("STATE: " + this.state.applist);
		fetch("/users")
			.then(res => res.json())
			.then(users => this.setState({users}));
	}

	render() {
		var apps = this.state.applist.map(myapp => {
			return (
				<App
					name={myapp}
					handleShow={this.showName}
					handleTotal={() => this.calculateTotal()}
				/>
			);
		});

		return (
			<div>
				<GetFromExpress />
				<Total total={this.state.total} />
				<AppForm handleCreate={newapp => this.createAPP(newapp)} />{" "}
				{apps}
			</div>
		);
	}
}

class Home extends Component {
	render() {
		return (
			<div>
				<Head />
				<Router>
					<div>
						<Link to="/">Home </Link>
						<Link to="/Errors">Errors </Link>
						<Link to="/Fragments">Fragments </Link>
						<Link to="/Portals">Portals </Link>
						<Switch>
							<Route
								exact
								path="/"
								component={ListOfFrameworks}
							/>
							<Route
								exact
								path="/Errors"
								component={ErrorBoundaries}
							/>
							<Route
								exact
								path="/Fragments"
								component={Fragments}
							/>
							<Route exact path="/Portals" component={Portal} />
						</Switch>
					</div>
				</Router>
			</div>
		);
	}
}

export default Home;
