const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/users')
const bcrypt = require('bcrypt')

loginRouter.post('/', async (request, response) => {
  try{
    const body = request.body
    const user = await User.findOne({ username: body.username })
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)
    if (!(user && passwordCorrect))
      return response.status(404).json({ error: 'Invalid user or password' })
    const userForToken = {
      name: user.name,
      id: user._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    response.send({ token, username: user.username, name: user.name })
  }catch(error) {
    console.log(error)
  }
})

module.exports = loginRouter