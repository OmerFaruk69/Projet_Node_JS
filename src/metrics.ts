import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'


export class Metric {
  public timestamp: string
  public value: number
  public username : string
  public key : number
   
  constructor(timestamp: string, value: number , username: string , key  :number) {
    this.timestamp = timestamp
    this.value = value
    this.username = username 
    this.key = key
  }


  public setMetric(timestampUpdate: string , valueUpdate : number): void {
    this.timestamp = timestampUpdate
    this.value = valueUpdate
    // Update metrics and change timestamp dans value !
  }
}

export class MetricsHandler {
  public db: any 
  
  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }
  
  public save(key: string, metrics: Metric[], callback: (error: Error | null) => void) {
    
    
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
        
        stream.write({ key: `metric:${key}:${m.timestamp}:${m.username}`, value: m.value })
      } 
    )
    stream.end()
  }
  
  public get(key: number,username:string, callback: (error: Error | null, result: any) => void) {
    
    let metrics: Metric[] = []
    this.db.createReadStream()
      .on('data', function (data) {
        let key2: number = data.key.split(":")[1]
        let username2: string = data.key.split(":")[3]
        if (key == key2 && username == username2 ) {
          let timestamp: string = data.key.split(':')[2]
          let username: string = data.key.split(':')[3]
          let metric: Metric = new Metric(timestamp, data.value, username,key)
          metrics.push(metric)
        }
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        console.log('Stream ended')
        callback(null, metrics)
      })
  }


  
  public getAllOwnMetrics(username : string, callback: (error: Error | null, result: any) => void) {
   
    let metrics: Metric[] = []
    this.db.createReadStream()
      .on('data', function (data) {
        

        let username2: string = data.key.split(":")[3]
        if (username  == username2) {
          let timestamp: string = data.key.split(':')[2]
          let username: string = data.key.split(':')[3]
          let metric: Metric = new Metric(timestamp, data.value, username,data.key.split(':')[1])
          metrics.push(metric)
          
        }
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        console.log('Stream ended')
        callback(null, metrics)
        
        
      })
  }

  public update (username : string ,key : string ,timestampUpdate : string , valueUpdate : number, callback: (error: Error | null, result: any) => void) {
    
    let metrics: Metric[] = []
    this.db.createReadStream()
      .on('data', function (data) {
        
       if(key == data.key.split(':')[1] && username == data.key.split(':')[3])
       {

          let timestamp: string = timestampUpdate
          let username: string = data.key.split(':')[3]
          let value : number = valueUpdate
          let metric: Metric = new Metric(timestamp, value, username,data.key.split(':')[1])
          metrics.push(metric)
       }   
      })
      .on('error', function (err) {
        console.log('Oh my!', err)
        callback(err, null)
      })
      .on('close', function () {
        console.log('Stream closed')
      })
      .on('end', function () {
        console.log('Stream ended')
        
        callback(null, metrics)
        
        
      })
  }



  public del(username : string ,key : number, callback: (error: Error | null, result?: Metric[]) => void) {
    
    const stream = this.db
            .createKeyStream()
      stream.on('error',callback)
      .on('data', data => {
        if (data.split(":")[1] === key  && data.split(":")[3] ==username ){
          
          this.db.del(data, function (err) {
          });
          
        
        }
        
        
    })
  }

}
