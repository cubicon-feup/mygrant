import React from "react";

const Aux = props => props.children;

class Mini extends React.Component {
	render() {
		return "A maneira mais curta.";
	}
}

class ReplacingDiv extends React.Component {
	render() {
		return (
			<Aux>
				<p key="1">Em vez do div</p>
				<p key="2">pode se usar um</p>
				<p key="3">encapsulamento dos children</p>
				<p key="4">que nao e um array</p>
				<p key="5">e por isso nao precisa da virgula</p>
				<hr />
			</Aux>
		);
	}
}

class Short extends React.Component {
	render() {
		return [
			<p key="1">Com os fragments</p>,
			<p key="2">nao precisa</p>,
			<p key="3">de ter o div</p>,
			<p key="4">quando é chamado o render</p>,
			<hr />
		];
	}
}

class Fragments extends React.Component {
	render() {
		return (
			<div>
				<Short />
				<ReplacingDiv />
				<Short />
                <Mini />
			</div>
		);
	}
}

export default Fragments;
