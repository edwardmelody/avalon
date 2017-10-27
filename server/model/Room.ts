import Person from './Person'

class Room {
	private static MAX_MESSAGE_LENGTH = 1000

	private client: any
	private _name: string
	private _personByName: { [key: string]: Person }
	private _personById: { [key: string]: Person }
	private _broadcastRoom: number
	private _messages: Array<{ person: Person, message: string }>
	private _triggerBroadcast = true


	constructor(name: string, broadcastRoom: number) {
		this._name = name
		this._broadcastRoom = broadcastRoom
		this._personByName = {}
		this._personById = {}
		this._messages = []
	}

	private addMessage(client: any): void {
		client.on('message', function (obj: any) {
			if (!obj || !obj.name || !obj.message) {
				return
			}
			this._messages.push({
				person: this.getPersonByName(obj.name),
				message: obj.message
			})
			if (this._messages.length > this.MAX_MESSAGE_LENGTH) {
				this._messages.pop()
			}
			this._triggerBroadcast = true
		}.bind(this))
	}

	get name(): string {
		return this._name
	}

	get messages(): Array<{ person: Person, message: string }> {
		return this._messages
	}

	get broadcastRoom(): number {
		return this._broadcastRoom
	}

	set triggerBroadcast(triggerBroadcast: boolean) {
		this._triggerBroadcast = triggerBroadcast
	}

	get triggerBroadcast(): boolean {
		return this._triggerBroadcast
	}

	addPerson(client: any, person: Person): void {
		this._personById[person.id] = person
		this._personByName[person.name] = person
		this.addMessage(client)
		this._triggerBroadcast = true
	}

	removePerson(person: Person): void {
		delete this._personById[person.id]
		delete this._personByName[person.name]
		this._triggerBroadcast = true
	}

	getPersonByName(name: string): Person {
		return this._personByName[name]
	}

	getPersonBySocketId(id: string): Person {
		return this._personById[id]
	}

	getPeople(): Array<string> {
		return Object.keys(this._personByName)
	}

	getLengthOfPersons(): number {
		return Object.keys(this._personById).length
	}
}

export default Room