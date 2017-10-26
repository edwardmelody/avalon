"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(name) {
        this._name = name;
        this._personByName = {};
        this._personById = {};
    }
    get name() {
        return this._name;
    }
    addPerson(person) {
        this._personById[person.id] = person;
        this._personByName[person.name] = person;
    }
    removePerson(person) {
        delete this._personById[person.id];
        delete this._personByName[person.name];
    }
    getPersonByName(name) {
        return this._personByName[name];
    }
    getPersonBySocketId(id) {
        return this._personById[id];
    }
    getLengthOfPersons() {
        return Object.keys(this._personById).length;
    }
}
exports.default = Room;
