"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("./model/Room");
const Person_1 = require("./model/Person");
class Main {
    constructor(io) {
        this.io = io;
        this.rooms = {};
        this.personsByName = {};
        this.personsById = {};
        this.initialBoardcast();
    }
    initialBoardcast() {
        setInterval(function () {
            let result = {};
            Object.keys(this.rooms).map(function (key) {
                result[key] = this.rooms[key].getLengthOfPersons();
            }.bind(this));
            this.io.emit('channelReply', result);
        }.bind(this), 1000);
    }
    joinRoom(personName, roomName, client) {
        let room = this.rooms[roomName];
        if (room) {
            client.join(roomName);
            this.personsByName[personName] = roomName;
            this.personsById[client.id] = roomName;
            room.addPerson(client, new Person_1.default(client.id, personName));
            console.log(personName + '[' + client.id + '] has been joined in ' + roomName + '. current people in the room are ' + room.getLengthOfPersons());
            client.emit('home-reply', {
                key: 'joinRoom',
                result: true,
                data: roomName
            });
            return;
        }
        console.log('room ' + roomName + ' has been created.');
        let broadcastRoom = setInterval(function () {
            this.io.to(roomName).emit('roomReply', {
                people: this.rooms[roomName].getPeople(),
                messages: this.rooms[roomName].messages
            });
        }.bind(this), 500);
        this.rooms[roomName] = new Room_1.default(roomName, broadcastRoom);
        this.joinRoom(personName, roomName, client);
    }
    leaveRoom(client) {
        let roomName = this.personsById[client.id];
        if (!roomName) {
            return;
        }
        let room = this.rooms[roomName];
        let person = room.getPersonBySocketId(client.id);
        room.removePerson(person);
        delete this.personsByName[person.name];
        delete this.personsById[client.id];
        console.log(person.name + '[' + client.id + '] leaving out from ' + roomName);
        if (room.getLengthOfPersons() <= 0) {
            clearInterval(room.broadcastRoom);
            delete this.rooms[roomName];
            console.log('room ' + roomName + ' has been deleted.');
        }
        client.emit('home-reply', {
            key: 'leaveRoom',
            result: true,
            data: roomName
        });
    }
}
exports.default = Main;
