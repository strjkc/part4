const blogRouter = require('express').Router()
const Blog = require('../models/blogs')
const User = require('../models/users')
const jwt = require('jsonwebtoken')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {name: 1, username: 1, id: 1})
  response.json(blogs)
    
})
blogRouter.post('/', async (request, response, next) => {
    const token = request.token
    const validUser = token === undefined
    ? false
    : jwt.verify(token, process.env.SECRET)
    const user = await User.findById(validUser.id)
    const blog = { ...request.body, likes: request.body.likes || 0 }
    blog.user = user._id
    const newBlog = new Blog(blog)
    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const blogId = request.params.id
  const token = request.token
  const validUser = token === undefined
  ? false
  : jwt.verify(token, process.env.SECRET)
  const user = await User.findById(validUser.id)
  if (!user.blogs.includes(blogId))
    return response.status(400).json({error: 'Note doesn\'t belong to the user'})
  user.blogs = user.blogs.filter(blogs => blogs != blogId)
  await user.save()
  await Blog.findByIdAndRemove(blogId)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const blogId = request.params.id
  if (!blogId)
    return response.status(400).json({error: 'Malformed request'})
  const blog = await Blog.findById(blogId)
  blog.likes = String(Number(blog.likes) + 1)
  const updatedBlog = await blog.save()
  response.status(201).send(updatedBlog)
})

module.exports = blogRouter