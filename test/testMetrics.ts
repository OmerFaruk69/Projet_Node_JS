import { expect } from 'chai'
import { Metric, MetricsHandler } from '../src/metrics'
import { User, UserHandler } from '../src/user'
import { LevelDB } from "../src/leveldb"
import WriteStream from 'level-ws'

const dbPath: string = 'db_test'
var dbMet: MetricsHandler



describe('User', function () {
    before(function () {
        LevelDB.clear(dbPath)
        dbMet = new MetricsHandler(dbPath)
    })
    after(function () {
        dbMet.db.close()
    })


    describe('#save', function () {
        const user: User = new User('azerty', 'azerty@gmail.com', 'azerty')
        let metrics: Metric[] = []
        const metric: Metric = new Metric("23-12-2019-11-27", 2, user.username, 2)
        metrics.push(metric)

        it('should add a new user', function (done) {
            dbMet.save("2",metrics, function (err) {
                if (err) done(err)
                else done()
            })
        })
    })

    describe('#get', function () {
        const username: string = "azerty"
        it('should get empty array on non existing group', function () {
            dbMet.get(0,username, function (err: Error | null, result?: User) {
                expect(err).to.be.null;
                expect(result).to.not.be.undefined
                expect(result).to.be.empty
            })
        })
    })
})