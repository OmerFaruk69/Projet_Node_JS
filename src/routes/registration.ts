import express from 'express'
const router = express.Router()
import bodyparser from 'body-parser'

router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))

router.get('/registration', (request, response) => {
    response.render('registration')
})

router.post('/registration', function (request, response) {
    console.log(request.body);
    response.redirect('/registration')
})
module.exports = router;