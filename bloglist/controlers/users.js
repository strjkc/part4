const usersController = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/users')

usersController.post('/', async (request, response, next) => {
  try{
    const saltRounds = 10
    const passHash = await bcrypt.hash(request.body.password, saltRounds)
    const newUser = new User({
      name: request.body.name,
      username: request.body.username,
      passwordHash: passHash
    })
    const savedUser = await newUser.save()
    response.json(savedUser)
  }catch(error){
    next(error)
  }
})

usersController.get('/', async (request, response) => {
  const allUsers = await User.find({})
  response.send(allUsers)
})

module.exports = usersController