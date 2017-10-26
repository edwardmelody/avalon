import Room from './model/Room'
import Person from './model/Person'

class Main {
    public io: object
    public rooms: { [key: string]: Room }
    public personsByName: { [key: string]: string }
    public personsById: { [key: string]: string }


    constructor(io: object) {
        this.io = io
        this.rooms = {}
        this.personsByName = {}
        this.personsById = {}
    }

    joinRoom(personName: string, roomName: string, client: any) {
        let room = this.rooms[roomName]
        if (room) {
            client.join(roomName)
            this.personsByName[personName] = roomName
            this.personsById[client.id] = roomName
            room.addPerson(new Person(client.id, personName))
            console.log(personName + '[' + client.id + '] has been joined in ' + roomName + '. current people in the room are ' + room.getLengthOfPersons())
            return
        }
        console.log('room ' + roomName + ' has been created.')
        this.rooms[roomName] = new Room(roomName)
        this.joinRoom(personName, roomName, client)
    }

    leaveRoom(client: any) {
        let roomName = this.personsById[client.id]
        if (!roomName) {
            return
        }
        let room = this.rooms[roomName]
        let person = room.getPersonBySocketId(client.id)
        room.removePerson(person)
        delete this.personsByName[person.name]
        delete this.personsById[client.id]
        console.log(person.name + '[' + client.id + '] leaving out from ' + roomName)
        if (room.getLengthOfPersons() <= 0) {
            delete this.rooms[roomName]
            console.log('room ' + roomName + ' has been deleted.')
        }
    }
}

export default Main