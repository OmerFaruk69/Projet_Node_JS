import express = require('express')
import path = require('path')
import bodyparser = require('body-parser');
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'
import { MetricsHandler, Metric } from './metrics'
import alert from 'alert-node'

const dbUser: UserHandler = new UserHandler('./db/users')
const LevelStore = levelSession(session)
const app = express()
const port: string = process.env.PORT || '8080'
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
app.set('views', path.join(__dirname, '/../view'));
app.set('view engine', 'ejs');

app.use(session({
	secret: 'my very secret phrase',
	store: new LevelStore('./db/sessions'),
	resave: true, 
	saveUninitialized: true
}))

app.get('/',(req, res) => res.render('accueil.ejs'))

  
//signup back end
app.get("/signup", function (req: any, res: any) {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAA")
    res.render('signup')
})
app.post('/signup', (req: any, res: any, next: any) => {
	dbUser.get(req.body.username, function (err: Error | null, result?: User) {
		if (!err || result !== undefined) {
			alert('User already exist')
			res.redirect('/signup')
		} else {
			dbUser.save(req.body, function (err: Error | null) {
				if (err) next(err)
				else alert('Account created')
            })
            res.redirect('/')
		}
	})
})


//login back end
app.get('/login', (req: any, res: any) => {
	res.render('login')
})
app.post('/login', (req: any, res: any, next: any) => {

	dbUser.get(req.body.username, (err: Error | null, result?: User) => {
		//if (err) next(err)
		console.log(result)
		if (result === undefined || !result.validatePassword(req.body.password)) {
			alert('User not found')
			res.redirect('/login')
		}
		else {
			req.session.loggedIn = true
			req.session.user = result
			res.redirect('/accueilUser')
		}
	})

})

//accueilUser back end
app.get('/accueilUser', (req: any, res: any) => {
	res.render('accueilUser', {username : req.session.user.username})
  })

//addMetrics
app.get('/addmetric', (req: any, res: any) => {
	res.render('addmetric')
  })
  app.post('/addmetric',(req : any , res : any , newt : any) => {
	let metrics : Metric [] = []
	let ts =Date.now();
	let date_ob = new Date(ts)
	let date = date_ob.getDate();
	let month = date_ob.getMonth() +1
	let year = date_ob.getFullYear()
	let hour = date_ob.getHours()
	let minute = date_ob.getMinutes()
	let timestamp = date.toString() + "-" + month.toString()+ "-" + year.toString()+ "-" + hour.toString()+ "-" + minute.toString()
	let metric = new Metric(timestamp.toString(), req.body.value,req.session.user.username,req.body.key)
	metrics.push(metric)
	console.log('0' + req.session.metric)
	dbMet.get(req.body.key ,req.session.user.username, (error: Error | null, result: any) =>  {
	  if( result.length==0)
	  {
		dbMet.save(req.body.key , metrics ,  (err: Error | null, result?: Metric) =>
		{
			  if (err) throw (err)
			  console.log("Metrics add")
			  res.redirect('/accueilUser')
			  console.log(req.session.metric)
			  }
		)
	  }
	  else {
	  alert("cle exite deja" )
	  res.redirect('/accueilUser')
	  }
	} ) 
  })

//delMetrics 
  app.get('/deletemetric', (req: any, res: any) => {
	res.render('deletemetric')
  })
  app.post('/deletemetric',(req : any , res : any , newt : any) => {
	console.log('0')
  
	dbMet.del(req.session.user.username,req.body.key, (err: Error | null) =>
	{
		  if (err) throw (err)      
		  // On rentre pas dans la boucle !!  
	  }
	)
	res.redirect('/deletemetric')
  
  })

//updateMetrics
app.get('/update', (req: any, res: any) => {
	res.render('update')
  })

app.post('/update', (req: any, res: any, next: any) => {
	let ts =Date.now();
let date_ob = new Date(ts)
let date = date_ob.getDate();
let month = date_ob.getMonth() +1
let year = date_ob.getFullYear()
let hour = date_ob.getHours()
let minute = date_ob.getMinutes()
let seconde = date_ob.getSeconds()
let timestamp = date.toString() + "-" + month.toString()+ "-" + year.toString()+ "-" + hour.toString()+ "-" + minute.toString()+ "-" + seconde.toString()

	dbMet.get(req.body.key,req.session.user.username, function (err: Error | null, result?: any) {
	  if (err || result == undefined) {
		next(err)
	  } else {
		dbMet.update(req.session.user.username, req.body.key , timestamp ,req.body.value, (error: Error | null, result: any) => {
		  dbMet.del(req.session.user.username , req.body.key ,(error: Error | null, result?: Metric[] | undefined) =>{})
		  dbMet.save(req.body.key , result, function (err: Error | null) {})

		}) 
		
	  }
	})
	res.redirect('/update')
})

//Bring Metric
app.get('/metrics', (req: any, res: any) => {
	dbMet.getAllOwnMetrics(req.session.user.username, (err: Error | null, result: any) => {
	  if (err) throw err
	  res.status(200).send(result)
	})
  })

//logout
app.get('/logout', (req: any, res: any) => {
	res.redirect('/login')
  })

//return button
app.get('/backAccueilUser', (req: any, res: any) => {
	res.redirect('/accueilUser')
  })

//return button
app.get('/back', (req: any, res: any) => {
	res.redirect('/')
  })


app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !!!');
});

app.listen(port, (err: Error) => {
    if (err) {
        throw err
    }
    console.log(`server is listening on port ${port}`)
})
