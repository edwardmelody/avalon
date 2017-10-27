import fs = require('fs')

class LangManager {

	private static _instance: LangManager = new LangManager()
	private _locale: string
	private _lang: any

	private constructor() {
		this._locale = 'en'
		this._lang = JSON.parse(fs.readFileSync(__dirname + '/config/' + this._locale + '.json', 'utf8'))
	}

	static get instance(): LangManager {
		return this._instance;
	}

	set locale(locale: string) {
		if (this._locale != locale) {
			this._lang = JSON.parse(fs.readFileSync(__dirname + '/config/' + this._locale + '.json', 'utf8'))
		}
		this._locale = locale
	}

	get locale(): string {
		return this._locale
	}

	get(cataKey: string, key: string): string {
		return this._lang[cataKey][key]
	}
}

export default LangManager.instance