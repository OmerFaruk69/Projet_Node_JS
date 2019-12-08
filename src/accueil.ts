import express from 'express'
import path from 'path'
import bodyparser from 'body-parser'

const app = express()
const port: string = process.env.PORT || '8080'

app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
app.set('views', path.join(__dirname, '/../view')); 
app.set('view engine', 'ejs');



app.get(
  '/',
  (req, res) => res.render('accueil.ejs')
)

app.get('/login', (req: any, res: any) => {
  res.render('login')
})

app.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

  app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !!!');
  });
app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})