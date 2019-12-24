import { expect } from 'chai'
import { User, UserHandler } from '../src/user'
import { LevelDB } from "../src/leveldb"
import WriteStream from 'level-ws'

const dbPath: string = 'db_test'
var dbUser: UserHandler



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
                                if (err) done(err)
                                else done()
                        })
                })
        })

        describe('#get', function () {
                const username : string = "azerty"
                it('should get empty array on non existing group', function () {
                        dbUser.get(username, function (err: Error | null, result?: User) {
                                expect(err).to.be.null;
                                expect(result).to.not.be.undefined
                        })
                })
        })
})
