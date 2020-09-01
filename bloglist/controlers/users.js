const usersController = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/users')

usersController.post('/', async (request, response) => {
    const saltRounds = 10
    if (request.body.password.length < 3)
    {
      return response.status(400).json({error: 'Password must contain at least 3 characters'})
    }
    const passHash = await bcrypt.hash(request.body.password, saltRounds)
    const newUser = new User({
      name: request.body.name,
      username: request.body.username,
      passwordHash: passHash
    })
    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
})

usersController.get('/', async (request, response) => {
  const allUsers = await User.find({})
  if (allUsers === null)
    return response.status(404).json({error: 'No users found'})
  response.send(allUsers)
})

module.exports = usersController