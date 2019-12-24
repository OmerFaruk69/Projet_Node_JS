import express = require('express')
import path = require('path')
import bodyparser = require('body-parser');
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'
import alert from 'alert-node'

const dbUser: UserHandler = new UserHandler('./db/users')
const LevelStore = levelSession(session)
const app = express()
const port: string = process.env.PORT || '8080'

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