"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class LangManager {
    constructor() {
        this._locale = 'en';
        this._lang = JSON.parse(fs.readFileSync(__dirname + '/config/' + this._locale + '.json', 'utf8'));
    }
    static get instance() {
        return this._instance;
    }
    set locale(locale) {
        if (this._locale != locale) {
            this._lang = JSON.parse(fs.readFileSync(__dirname + '/config/' + this._locale + '.json', 'utf8'));
        }
        this._locale = locale;
    }
    get locale() {
        return this._locale;
    }
    get(cataKey, key) {
        return this._lang[cataKey][key];
    }
}
LangManager._instance = new LangManager();
exports.default = LangManager.instance;
