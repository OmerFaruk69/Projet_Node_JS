import { expect } from 'chai'
import { User, UserHandler } from '../src/user'
import { LevelDB } from "../src/leveldb"
import WriteStream from 'level-ws'

const dbPath: string = 'db_test'
var dbUser: UserHandler 
var user1:User


describe('User', function () {
        before(function () {
                LevelDB.clear(dbPath)
                dbUser = new UserHandler(dbPath)
        })
        after(function () {
                dbUser.db.close()
        })

        describe('#get', function () {
                const username : string = "aze"
                it('should get empty array on non existing group', function () {
                        dbUser.get(username, function (err: Error | null, result?: User) {
                                expect(err).to.be.null;
                                expect(result).to.not.deep.equal(undefined);
                        })
                })
        })

        describe('#save', function () {
                const user : User = new User ('azerty','azerty@gmail.com','azerty')
                it('should add a new user', function () {
                        dbUser.save(user, function (err: Error | null) {
                                expect(err).to.not.be.null
                        })
                })
        })
})


it('verifier 1=1', function () {
        expect(1).to.equal(1);
})