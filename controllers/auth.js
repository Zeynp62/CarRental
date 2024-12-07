const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

//routes
router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({
      username: req.body.username
    })
    if (userInDatabase) {
      return res.send('Username is taken.')
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password and confirm password must match.')
    }

    //if username & password is valid :
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    req.body.password = hashedPassword
    const user = await User.create(req.body)
    res.send(`Thanks for signing ${user.username} up you can log in now. `)
  } catch (error) {
    console.log(error)
  }
})
