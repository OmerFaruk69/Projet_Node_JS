import express from 'express'
const router = express.Router()


router.get('/registration', (req: any, res: any) => {
    res.render('registration')
  })

  module.exports = router;