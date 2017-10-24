let express = require('express');
let app = express();
let http = require('http').Server(app)
let path = require('path');
let port = 9090;



app.use(express.static(path.join(__dirname, 'client')))

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
})

let io = require('socket.io')(http)

let Main = require('./src/Main')
let main = new Main(io)

io.on('connection', function (socket) {
	console.log('a user connected')
	socket.on('joinRoom', function (obj) {
		main.joinRoom(obj, this)
	})

	socket.on('disconnect', function () {
		main.leaveRoom(this)
	})
})

http.listen(port, function () {
	console.log('listening on *:' + port)
})
