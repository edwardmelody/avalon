import React, { Component } from 'react'
import { render } from 'react-dom'
import {
	HashRouter,
	Route,
	Switch,
	Link
} from 'react-router-dom'

import Home from './module/Home'
import Room from './module/Room'

class App extends Component {

	constructor(props) {
		super(props)
	}

	componentDidMount() {
	}

	render() {
		return (
			<div>
				<nav>
					<div className="nav-wrapper red darken-1">
						<a href="#" className="brand-logo"><img src="./images/logo.png" /></a>
						<a href="#" class="brand-logo center">Avalon</a>
					</div>
				</nav>
				<Switch>
					<Route exact path='/' component={Home} />
					<Route path='/room/:channelName' component={Room} />
				</Switch>
			</div>
		)
	}
}

export default App

$(document).ready(function () {
	render(
		<HashRouter>
			<App />
		</HashRouter>,
		document.getElementById('app')
	)
})