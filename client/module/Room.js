import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Room extends Component {

	constructor(props) {
		super(props)
		this.state = {
			people: [],
			messages: []
		}
		this.onSubmitMessage = this.submitMessage.bind(this)
	}

	componentWillMount() {
		this.socket = this.props.location.state.socket
		this.name = this.props.location.state.name
	}

	componentDidMount() {
		this.socket.on('roomReply', function (obj) {
			if (!obj) {
				return
			}
			this.setState((prevState, props) => {
				return {
					people: obj.people,
					messages: obj.messages
				}
			})
		}.bind(this))

		$('.r-textarea').focus()
	}

	submitMessage(e) {
		let text = e.target.innerHTML
		if (text.length > 1000) {
			e.preventDefault()
			return false
		}
		let code = e.keyCode
		if (code === 13 && !e.shiftKey) { // enter
			this.socket.emit('message', {
				name: this.name,
				message: text
			})
			e.target.innerHTML = ''
			e.preventDefault()
			return false
		}
		return true
	}

	render() {
		return (
			<div>
				<div className="r-top-container">
					<div className="r-left-container">
						{
							this.state.messages.map(function (obj, index) {
								let className = 'r-friend-message-box'
								if (this.name === obj.person._name) {
									className = ' r-user-message-box'
								}
								return (
									<div key={'message_' + index} className={className}>
										<h5>{obj.person._name}</h5>
										{
											obj.message.split('<br>').map((text) => {
												return <p>{text}</p>
											})
										}
									</div>
								)
							}.bind(this))
						}
					</div>
					<div className="r-right-container">
						<div className="r-inner">
							<ul className="collection">
								{
									this.state.people.map(function (name) {
										let className = 'collection-item'
										if (name === this.name) {
											className += ' active'
										}
										return (
											<li className={className}>{name}</li>
										)
									}.bind(this))
								}
							</ul>
						</div>
					</div>
				</div>
				<div className="r-bottom-container red darken-2">
					<div className="r-chat-box-container">
						<div className="r-chat-box">
							<div className="r-textarea" contentEditable="true" placeholder="typing your mind" onKeyDown={(e) => this.onSubmitMessage(e)}></div>
						</div>
					</div>
				</div>
			</div>
		)
	}

}

export default Room