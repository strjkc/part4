const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')


blogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})
blogRouter.post('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    const blog = { ...request.body }
    blog.user = users[0]._id
    const newBlog = new Blog(blog)
    const savedBlog = await newBlog.save()
    response.status(201).json(savedBlog)
  }catch(error){next(error)}
})

module.exports = blogRouter