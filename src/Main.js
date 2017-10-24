const Main = function (io) {
	this.io = io
	this.rooms = {}
	this.persons = {}
}

Main.prototype.joinRoom = function (obj, client) {
	if (this.rooms[obj.name]) {
		client.join(obj.name)
		this.persons[client.id] = obj
		this.rooms[obj.name].persons[client.id] = true
		console.log(client.id + ' has been joined in ' + obj.name)
		return
	}
	let newRoom = this.io.of(obj.name)
	console.log('room ' + obj.name + ' has been created.')
	this.rooms[obj.name] = {
		channel: newRoom,
		persons: {}
	}
	this.joinRoom(obj, client)
}

Main.prototype.leaveRoom = function (client) {
	let obj = this.persons[client.id]
	if (!obj) {
		return
	}
	delete this.rooms[obj.name].persons[client.id]
	delete this.persons[client.id]
	console.log(client.id + ' leaving out from ' + obj.name)
}

module.exports = Main