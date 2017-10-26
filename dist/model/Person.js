"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Person {
    constructor(id, name) {
        this._id = id;
        this._name = name;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
}
exports.default = Person;
