const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')
const jwt = require('jsonwebtoken')
const extractToken = require('../utils/middleware').extractToken


blogRouter.get('/', (request, response) => {
  console.log('???')
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})
blogRouter.post('/', async (request, response, next) => {
  try {
    const token = request.token
    console.log('BLOGS token', request.token)
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

blogRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id
  const token = request.token
  const validUser = jwt.verify(token, process.env.SECRET)
  if (!token || !validUser)
    return response.status(400).json({error: 'Token missing or invalid'})
  const user = await User.findById(validUser.id)
  if (!user.blogs.includes(blogId))
    return response.status(400).json({error: 'Note doesn\'t belong to the user'})
  user.blogs = user.blogs.filter(blogs => blogs != blogId)
  await user.save()
  await Blog.findByIdAndRemove(blogId)
  response.status(204).end()
})

module.exports = blogRouter