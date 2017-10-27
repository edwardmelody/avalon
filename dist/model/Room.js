"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(name, broadcastRoom) {
        this._triggerBroadcast = true;
        this._name = name;
        this._broadcastRoom = broadcastRoom;
        this._personByName = {};
        this._personById = {};
        this._messages = [];
    }
    addMessage(client) {
        client.on('message', function (obj) {
            if (!obj || !obj.name || !obj.message) {
                return;
            }
            this._messages.push({
                person: this.getPersonByName(obj.name),
                message: obj.message
            });
            if (this._messages.length > this.MAX_MESSAGE_LENGTH) {
                this._messages.pop();
            }
            this._triggerBroadcast = true;
        }.bind(this));
    }
    get name() {
        return this._name;
    }
    get messages() {
        return this._messages;
    }
    get broadcastRoom() {
        return this._broadcastRoom;
    }
    set triggerBroadcast(triggerBroadcast) {
        this._triggerBroadcast = triggerBroadcast;
    }
    get triggerBroadcast() {
        return this._triggerBroadcast;
    }
    addPerson(client, person) {
        this._personById[person.id] = person;
        this._personByName[person.name] = person;
        this.addMessage(client);
        this._triggerBroadcast = true;
    }
    removePerson(person) {
        delete this._personById[person.id];
        delete this._personByName[person.name];
        this._triggerBroadcast = true;
    }
    getPersonByName(name) {
        return this._personByName[name];
    }
    getPersonBySocketId(id) {
        return this._personById[id];
    }
    getPeople() {
        return Object.keys(this._personByName);
    }
    getLengthOfPersons() {
        return Object.keys(this._personById).length;
    }
}
Room.MAX_MESSAGE_LENGTH = 1000;
exports.default = Room;
