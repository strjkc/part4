const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controlers/blogs')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const usersRouter = require('./controlers/users')
const loginRouter = require('./controlers/login')

mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then( () => logger.info('Connected to database'))
  .catch( error => logger.error('Unable to connect to database: ', error.message))

app.use(cors())
app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/login', loginRouter)
app.use(middleware.invalidPath)
app.use(middleware.errorHandler)

module.exports = app