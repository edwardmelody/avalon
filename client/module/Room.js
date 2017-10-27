import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import UIUtil from './../util/UIUtil'

class Room extends Component {

	constructor(props) {
		super(props)
		this.state = {
			people: [],
			messages: []
		}
		this.tempText = ''
		this.onSubmitMessage = this.submitMessage.bind(this)
		this.manLengthOfMessage = 10000
		this.toggleScroll = false
	}

	componentWillMount() {
		this.socket = this.props.location.state.socket
		this.personName = this.props.location.state.personName
		this.channelName = this.props.location.state.channelName
	}

	componentWillUpdate() {
		let messageBox = $('.r-left-container')
		if (messageBox.scrollTop() + messageBox.height() === messageBox.prop('scrollHeight')) {
			this.toggleScroll = true
		}
	}

	componentDidUpdate() {
		let messageBox = $('.r-left-container')
		if (this.toggleScroll) {
			messageBox[0].scrollTo(0, messageBox.prop('scrollHeight'))
		}
		this.toggleScroll = false
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

		if (UIUtil.isMobile()) {
			$('.r-textarea').css('margin-right', '1em')
			$('#btnSendMessage').removeClass('m-nonvisible')
		}
		$('.r-textarea').focus()
	}

	componentWillUnmount() {
		this.socket.emit('leaveRoom', null)
	}

	submitMessage(e) {
		let text = e.target.innerHTML
		if (text.length > this.manLengthOfMessage) {
			e.target.innerHTML = this.tempText
			let range, selection;
			if (document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
			{
				range = document.createRange();//Create a range (a range is a like the selection but invisible)
				range.selectNodeContents(e.target);//Select the entire contents of the element with the range
				range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
				selection = window.getSelection();//get the selection object (allows you to change selection)
				selection.removeAllRanges();//remove any selections already made
				selection.addRange(range);//make the range you have just created the visible selection
			}
			else if (document.selection)//IE 8 and lower
			{
				range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
				range.moveToElementText(e.target);//Select the entire contents of the element with the range
				range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
				range.select();//Select the range (make it the visible selection
			}
			return true
		}
		this.tempText = text
		let code = e.keyCode
		if (code === 13 && !e.shiftKey) { // enter
			this.sendMessage()
			e.preventDefault()
			return false
		}
		return true
	}

	sendMessage() {
		let text = $('.r-textarea').html()
		this.socket.emit('message', {
			name: this.personName,
			message: text
		})
		$('.r-textarea').html('')
	}

	render() {
		return (
			<div>
				<div className="r-top-container">
					<div className="r-left-container">
						{
							this.state.messages.map(function (obj, index) {
								let className = 'r-friend-message-box'
								if (this.personName === obj.person._name) {
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
							<ul className="collection with-header">
								<li className="collection-header"><h5>{this.channelName} ({this.state.people.length})</h5></li>
								{
									this.state.people.map(function (name) {
										let className = 'collection-item'
										if (name === this.personName) {
											className += ' red lighten-2'
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
						<div className="r-textarea" contentEditable="true" placeholder="typing your mind" onKeyDown={(e) => this.onSubmitMessage(e)}></div>
						<a id="btnSendMessage" onClick={this.sendMessage.bind(this)} className="waves-effect waves-light btn red lighten-2 m-nonvisible">send</a>
					</div>
				</div>
			</div>
		)
	}

}

export default Room