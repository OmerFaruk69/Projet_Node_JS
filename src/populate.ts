import { User, UserHandler } from './user'
import { MetricsHandler, Metric } from './metrics'

console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAA")
const dbUser: UserHandler = new UserHandler('./db/users')
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

//first user and his metrics
const user1: User = new User("paula", "paula@gmail.com", "paula")
let metrics1 : Metric [] = []
const metric1: Metric = new Metric("24-12-2019-10-27",1,user1.username,1)
metrics1.push(metric1)


//second user an his metrics
const user2: User = new User("jeana", "jeana@gmail.com", "jeana")
let metrics2 : Metric [] = []
const metric2: Metric = new Metric("23-12-2019-11-27",2,user2.username,2)
metrics1.push(metric2)

//add first user and his metrics
console.log("EEEEEEEEEEEEEEEEE")
dbUser.save(user1, function (err: Error | null) {
    console.log("BBBBBBBBBBBBBBBBB")
    console.log("erreur: "+err)
    return 
})
dbMet.save("1",metrics1,function (err: Error | null) {
    console.log("DDDDDDDDDDDDDDDDDD")
    console.log("erreur: "+err)
    return 
})

//add second user and his metrics
dbUser.save(user2, function (err: Error | null) {
    console.log("DDDDDDDDDDDDDDDDDD")
    console.log("erreur: "+err)
    return 
})
dbMet.save("2",metrics2,function (err: Error | null) {
    console.log("DDDDDDDDDDDDDDDDDD")
    console.log("erreur: "+err)
    return 
})

console.log("RRRRRRRRRRRRRRRRRR")
dbUser.db.close()