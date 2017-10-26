import Person from './Person'

class Room {
    private _name: string
    private _personByName: { [key: string]: Person }
    private _personById: { [key: string]: Person }

    constructor(name: string) {
        this._name = name
        this._personByName = {}
        this._personById = {}
    }

    get name(): string {
        return this._name
    }

    addPerson(person: Person): void {
        this._personById[person.id] = person
        this._personByName[person.name] = person
    }

    removePerson(person: Person): void {
        delete this._personById[person.id]
        delete this._personByName[person.name]
    }

    getPersonByName(name: string): Person {
        return this._personByName[name]
    }

    getPersonBySocketId(id: string): Person {
        return this._personById[id]
    }

    getLengthOfPersons(): number {
        return Object.keys(this._personById).length
    }
}

export default Room