const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const session = require('express-session')
const passUsertoView = require('./middleware/pass-user-to-view')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')

const PORT = process.env.PORT ? process.env.PORT : '3000'

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`connected to mongoDB: ${mongoose.Collection.name}`)
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)
app.use(passUsertoView)

const authCtrl = require('./controllers/auth')
const isSignedIn = require('./middleware/is-signed-in')

app.use('/auth', authCtrl)

app.get('/', async (req, res) => {
  res.render('index.ejs')
})

app.listen(PORT, () => {
  console.log('auth app  listening')
})
