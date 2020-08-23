const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const extractToken = require('../utils/middleware').extractToken


blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})
blogRouter.post('/', async (request, response, next) => {
  try {
    const token = extractToken(request)
    console.log('token', token)
    const validUser = jwt.verify(token, process.env.SECRET)
    if (!token || !validUser)
      return response.status(400).json({ error: 'Token missing or invalid' })
    const user = await User.findById(validUser.id)
    const blog = { ...request.body }
    blog.user = user._id
    const newBlog = new Blog(blog)
    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }catch(error){next(error)}
})

module.exports = blogRouter