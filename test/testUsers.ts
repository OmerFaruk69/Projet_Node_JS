import { expect } from 'chai'
import { User, UserHandler } from '../src/user'
import { LevelDB } from "../src/leveldb"
import WriteStream from 'level-ws'

const dbPath: string = 'db_test'
var dbUser: UserHandler
var user1: User


describe('User', function () {
        before(function () {
                LevelDB.clear(dbPath)
                dbUser = new UserHandler(dbPath)
        })
        after(function () {
                dbUser.db.close()
        })


        describe('#save', function () {
                const user: User = new User('azerty', 'azerty@gmail.com', 'azerty')
                it('should add a new user', function (done) {
                        dbUser.save(user, function (err) {
                                console.log("AAAAAAAAAAAAAAAAAAAAAAA"+err)
                                if (err) done(err)
                                else done()
                        })
                })
        })

        describe('#get', function () {
                const username : string = "azerty"
                it('should get empty array on non existing group', function () {
                        dbUser.get(username, function (err: Error | null, result?: User) {
                                console.log("BBBBBBBBBBB"+err)
                                console.log("BBBBBBBBBBB"+result)
                                expect(err).to.be.null;
                                expect(result).to.not.be.undefined
                        })
                })
        })
})
