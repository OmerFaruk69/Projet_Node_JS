import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'

export class User {
	public username: string
	public email: string
	public password: string = ""

	constructor(username: string, email: string, password: string) {
		this.username = username
		this.email = email
		this.password = password
	}

	static fromDb(username: string, value: any): User {
		console.log('value:' + value)
		const [password, email] = value.split(":")

		return new User(username, email, password)
	}

	public setPassword(toSet: string): void {
		this.password = toSet
		// Hash and set password
	}

	public setUserName(toSet: string): void {
		this.username = toSet

		// Hash and set password
	}


	public getPassword(): string {
		return this.password
	}
	public getUsername(): string {
		return this.password
	}

	public validatePassword(toValidate: String): boolean {
		if (toValidate == this.getPassword())
			return (true)
		else return false

	}


}

export class UserHandler {

	public db: any
	constructor(path: string) {

		this.db = LevelDB.open(path)
	}
	public get(username: string, callback: (err: Error | null, result?: User) => void) {
		this.db.get(`user:${username}`, function (err: Error, data: any) {
			console.log('Data :' + data)
			console.log(User.fromDb)
			if (err) callback(err)
			else if (data === undefined) callback(null, data)
			else callback(null, User.fromDb(username, data))

			// Je recupère email et password si tous se passe bien !
		})
	}

	public save(user: User, callback: (err: Error | null) => void) {
		console.log('username update ' + user.username)
		this.db.put(`user:${user.username}`, `${user.password}:${user.email}`, (err: Error | null) => {

			if (err) callback(err)
		})
	}

	public delete(username: string, callback: (err: Error | null) => void) {
		console.log('delete user: '+username)
		this.db.del(`user:${username}`, (err: Error | null) => {

			if (err) callback(err)
		})
	}



}