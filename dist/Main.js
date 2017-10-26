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
    }
    joinRoom(personName, roomName, client) {
        let room = this.rooms[roomName];
        if (room) {
            client.join(roomName);
            this.personsByName[personName] = roomName;
            this.personsById[client.id] = roomName;
            room.addPerson(new Person_1.default(client.id, personName));
            console.log(personName + '[' + client.id + '] has been joined in ' + roomName + '. current people in the room are ' + room.getLengthOfPersons());
            return;
        }
        console.log('room ' + roomName + ' has been created.');
        this.rooms[roomName] = new Room_1.default(roomName);
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
            delete this.rooms[roomName];
            console.log('room ' + roomName + ' has been deleted.');
        }
    }
}
exports.default = Main;
