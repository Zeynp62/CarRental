const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

//routes
//get and post for sign up
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
//get and post for sign in
router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs')
})

router.post('/sign-in', async (req, res) => {
  const userInDatabase = await User.findOne({
    username: req.body.username
  })
  if (!userInDatabase) {
    return res.send('Wrong username or password')
  }

  const validPassword = bcrypt.compareSync(
    req.bosy.password,
    userInDatabase.password
  )
  if (!validPassword) {
    return res.send('Wrong username or password')
  }

  //if the username and password ia valid :
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  }
  res.redirect('/')
})
//for sign-out
router.get('/sign-out', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

module.exports = router
