import { expect } from 'chai'
import { User, UserHandler } from '../src/user'
import { LevelDB } from "../src/leveldb"

const dbPath: string = 'db_test'
var dbUser: UserHandler 

describe('User', function () {
        before(function () {
                LevelDB.clear(dbPath)
                dbUser = new UserHandler(dbPath)
        })

        describe('#get', function () {
                it('should get empty array on non existing group', function () {
                        dbUser.get("0", function (err: Error | null, result?: User) {
                                expect(err).to.be.null
                                expect(result).to.not.be.undefined
                                expect(result).to.be.empty
                        })
                })
        })

        describe('#save', function () {
                const user : User = new User ('azerty','azerty@gmail.com','azerty')
                it('should add a new user', function () {
                        dbUser.save(user, function (err: Error | null) {
                                expect(err).to.be.null
                        })
                })
        })

        after(function () {
                dbUser.db.close()
        })
})



it('verifier 1=1', function () {
        expect(1).to.equal(1);
})