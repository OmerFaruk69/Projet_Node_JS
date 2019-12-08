import express from 'express'
const router = express.Router()


router.get('/login', (req: any, res: any) => {
    res.render('login')
  })

  module.exports = router;