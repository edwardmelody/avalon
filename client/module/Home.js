import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class Home extends Component {

	constructor(props) {
		super(props)
		this.state = {
			rooms: {}
		}
		this.name = ''
		this.channelName = ''
		this.socket = io('http://localhost:9090')

		this.onClickJoinChannel = this.joinChannel.bind(this);
	}

	componentWillMount() {
		if (typeof (Storage) !== "undefined") {
			this.name = localStorage.getItem("name")
			if (this.name) {
				$('#name').val(this.name)
			}
		}
	}

	componentDidUpdate() {
	}

	componentDidMount() {
		$("#channelModal").modal({
			dismissible: true, // Modal can be dismissed by clicking outside of the modal
			startingTop: '10%', // Starting top style attribute
			endingTop: '10%', // Ending top style attribute
			inDuration: 0, // Transition in duration
			outDuration: 100, // Transition out duration
			ready: function (modal, trigger) {
				$("#channelName").focus()
			},
			complete: function () {
				if ($("#channelForm")[0])
					$("#channelForm")[0].reset()
			}
		})

		this.socket.on('home-reply', function (obj) {
			if (!obj) {
				return
			}
			if (!obj.result) {
				if (obj.message) {
					Materialize.toast(obj.message, 4000)
				}
				return
			}
			let key = obj.key
			if (key === 'joinRoom') {
				this.props.history.push({
					pathname: '/room/' + obj.data,
					state: {
						socket: this.socket,
						personName: this.name,
						channelName: this.channelName
					}
				})
			}
		}.bind(this))

		this.socket.on('channelReply', function (obj) {
			if (!obj || obj.length == 0) {
				return
			}
			this.setState((prevState, props) => {
				return {
					rooms: obj
				}
			})
		}.bind(this))

		Materialize.updateTextFields()
	}

	componentWillUnmount() {
		if (typeof (Storage) !== "undefined") {
			let name = $('#name').val()
			if (name) {
				localStorage.setItem("name", name)
			}
		}
	}

	showCreateChannelModal() {
		if (!this.validateName()) {
			return
		}
		$("#btnJoinChannel").removeClass('m-nonvisible').addClass('m-nonvisible')
		$("#btnCreateChannel").removeClass('m-nonvisible')
		$("#channelModal").modal('open')
	}

	showJoinChannelModal() {
		if (!this.validateName()) {
			return
		}
		$("#btnCreateChannel").removeClass('m-nonvisible').addClass('m-nonvisible')
		$("#btnJoinChannel").removeClass('m-nonvisible')
		$("#channelModal").modal('open')
	}

	onChannelModalSubmit() {
		if (!$("#btnCreateChannel").hasClass('m-nonvisible')) {
			this.createChannel()
		} else if (!$("#btnJoinChannel").hasClass('m-nonvisible')) {
			this.joinChannel()
		}
		return false
	}

	joinChannel(data) {
		if (!this.validateName()) {
			return
		}
		let channelName = null
		if (typeof (data) === 'string') {
			channelName = data
			this.channelName = channelName
		} else {
			if (!this.validateChannelName()) {
				return
			}
			channelName = this.channelName
		}
		this.socket.emit('joinRoom', {
			roomName: channelName,
			personName: this.name
		})
		$("#channelModal").modal('close')
	}

	createChannel() {
		if (!this.validateName()) {
			return
		}
		if (!this.validateChannelName()) {
			return
		}
		this.socket.emit('joinRoom', {
			roomName: this.channelName,
			personName: this.name
		})
		$("#channelModal").modal('close')
	}

	validateName() {
		let name = $('#name').val()
		if (!name) {
			Materialize.toast('Please input your name before.', 4000)
			return false
		}
		this.name = name
		return true
	}

	validateChannelName() {
		let channelName = $("#channelName").val()
		if (!channelName) {
			Materialize.toast('Please input channel name before.', 4000)
			return false
		}
		this.channelName = channelName
		return true
	}

	render() {
		return (
			<div>
				<iframe name="iframe-dummy"></iframe>
				<div className="m-before-content"></div>
				<div className="h-left-container">
					<div className="row">
						<form id="mainForm" className="col s12">
							<div className="row">
								<div className="input-field col s12">
									<i className="material-icons prefix">account_circle</i>
									<input id="name" type="text" className="validate" defaultValue={this.name} autoComplete="false" />
									<label for="name">Your name</label>
								</div>
							</div>
							<div className="row">
								<div className="input-field col s12 right-align">
									<a onClick={this.showJoinChannelModal.bind(this)} className="waves-effect waves-light btn red darken-1 h-button" href="javascript:void(0)"><i className="material-icons left">smoking_rooms</i>join channel</a>
								</div>
							</div>
							<div className="row">
								<div className="input-field col s12 right-align">
									<a onClick={this.showCreateChannelModal.bind(this)} className="waves-effect waves-light btn green accent-4 h-button" href="javascript:void(0)"><i className="material-icons left">games</i>create channel</a>
								</div>
							</div>
						</form>
					</div>
				</div>
				<div className="h-right-container">
					<div className="row">
						<div className="col s12">
							<div className="collection">
								{
									Object.keys(this.state.rooms).map(function (key) {
										let count = this.state.rooms[key]
										return (
											<a key={key} onClick={() => this.onClickJoinChannel(key)} href="javascript:void(0)" className="collection-item">{key} ({count})</a>
										)
									}.bind(this))
								}
							</div>
						</div>
					</div>
				</div>

				{ /* Modals */}
				<div id="channelModal" class="modal">
					<div className="modal-content">
						<div className="row">
							<form target="iframe-dummy" id="channelForm" className="col s12" onSubmit={this.onChannelModalSubmit.bind(this)}>
								<div className="row">
									<div className="input-field col s12">
										<i className="material-icons prefix">smoking_rooms</i>
										<input id="channelName" type="text" className="validate" autoComplete="false" />
										<label for="channelName">Channel Name</label>
									</div>
								</div>
							</form>
						</div>
					</div>
					<div class="modal-footer">
						<a href="javacript:void(0)" class="modal-action modal-close waves-effect waves-red btn-flat">cancel</a>
						<a id="btnCreateChannel" onClick={this.createChannel.bind(this)} href="javacript:void(0)" class="waves-effect waves-green btn-flat m-nonvisible">create</a>
						<a id="btnJoinChannel" onClick={this.joinChannel.bind(this)} href="javacript:void(0)" class="waves-effect waves-green btn-flat m-nonvisible">join</a>
					</div>
				</div>
			</div>
		)
	}
}

export default Home