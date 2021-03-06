const listHelper = require('../utils/list_helper')
const User = require('../models/users')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)
const Blog = require('../models/blogs')
const { set } = require('../app')

let token = null
beforeEach( async () => {
  const user = await User.findOne({})
  user.blogs = []
  await Blog.deleteMany({})
  const newBlog = new Blog({
    title: 'Initial Blog',
    author: 'Before Each function',
    content: 'This is a new blog post',
    url: 'http://thisisfake.com',
    likes: '432',
    user: user._id
  })    
  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const logIn = await api.post('/api/login')
  .send({username: user.username, password: 'root'})
  token = `bearer ${logIn.body.token}`
})


test('Dummy returns 1', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)

  expect(result).toBe(1)
})

describe('Total Likes', () => {
  test('Empty array sums to 0', () => {
    const blogs = []
    const result = listHelper.totalLikes(blogs)

    expect(result).toBe(0)
  })
  test('Sum of single blog is the amount of likes of that blog', () => {
    const blogs = [{
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "me",
      url: "http://www.thisisalink.com",
      likes: "1000",
      __v: 0
    }]
    const result = listHelper.totalLikes(blogs)

    expect(result).toBe(Number(blogs[0].likes))
  })
  test('Sum of bigger list is calculated correctly', () => {
    const blogs = [{
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "me",
      url: "http://www.thisisalink.com",
      likes: "1000",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "me",
      url: "http://www.thisisalink.com",
      likes: "10",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "me",
      url: "http://www.thisisalink.com",
      likes: "5",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "me",
      url: "http://www.thisisalink.com",
      likes: "100",
      __v: 0
    }]
    const result = listHelper.totalLikes(blogs)

    expect(result).toBe(1115)
  })
})

describe('Favorite blog', () => {
  test('Blog wit most likes', () => {
    const blogs = [{
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "me",
      url: "http://www.thisisalink.com",
      likes: "1000",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "me",
      url: "http://www.thisisalink.com",
      likes: "10",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "me",
      url: "http://www.thisisalink.com",
      likes: "5",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "me",
      url: "http://www.thisisalink.com",
      likes: "50000",
      __v: 0
    }]

    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(blogs[3])

  })
  test('Best blogger', () => {
    const blogs = [{
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Strahinja",
      url: "http://www.thisisalink.com",
      likes: "1000",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "me",
      url: "http://www.thisisalink.com",
      likes: "1000",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Strahinja",
      url: "http://www.thisisalink.com",
      likes: "1000",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Strahinja",
      url: "http://www.thisisalink.com",
      likes: "1000",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Marko",
      url: "http://www.thisisalink.com",
      likes: "10",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Marko",
      url: "http://www.thisisalink.com",
      likes: "5",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Marko",
      url: "http://www.thisisalink.com",
      likes: "50000",
      __v: 0
    },{
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Strahinja",
      url: "http://www.thisisalink.com",
      likes: "50000",
      __v: 0
    }]
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({ author: 'Strahinja', count: 4 })
  })
  test('most likes', () => {
    const blogs = [{
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Strahinja",
      url: "http://www.thisisalink.com",
      likes: "1000",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "me",
      url: "http://www.thisisalink.com",
      likes: "10",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Strahinja",
      url: "http://www.thisisalink.com",
      likes: "1000",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Strahinja",
      url: "http://www.thisisalink.com",
      likes: "1000",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Marko",
      url: "http://www.thisisalink.com",
      likes: "100",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Marko",
      url: "http://www.thisisalink.com",
      likes: "100",
      __v: 0
    },
    {
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Marko",
      url: "http://www.thisisalink.com",
      likes: "100",
      __v: 0
    },{
      _id: "5f31c78231564ce78565d0a5",
      title: "A test",
      author: "Strahinja",
      url: "http://www.thisisalink.com",
      likes: "1000",
      __v: 0
    }]
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({ author: 'Strahinja', total: 4000 })
  })
})

describe('Test user creation', () => {

  test('User is created', async () => {
    const initialUsers = await User.find({})

    const newUser = {
      username: 'newUser',
      name: 'Mr New',
      password: 'imjustapoorboyfromapoorfamily'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const newUsers = await User.find({})
    expect(newUsers.length).toBe(initialUsers.length + 1)
  })

  test('User with username < 3 chars can\'t be created', async () => {
    const initialUsers = await User.find({})
    const newUser = {
      username: 'ne',
      name: 'Mr New',
      password: 'imjustapoorboyfromapoorfamily'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const newUsers = await User.find({})
    expect(newUsers.length).toBe(initialUsers.length)
  })

  test('User with password < 3 chars can\'t be created', async () => {
    const initialUsers = await User.find({})
    const newUser = {
      username: 'newUser',
      name: 'Mr New',
      password: 'im'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    const newUsers = await User.find({})
    expect(newUsers.length).toBe(initialUsers.length)
  })

})

describe('blogs can be retrieved', () => {
   test('all blogs can be retreived', async () => {
    const allBlogs = await Blog.find({})
    const blogsFromApi = await api.get('/api/blogs')
                                .expect(200)
                                .expect('Content-Type', /application\/json/)
    expect(blogsFromApi.body.length).toBe(allBlogs.length)
  })

  test('blogs contain "id" property', async () => {
    const blogs = await Blog.find({})
    const jsonBlogs = blogs.map(blog => JSON.parse(JSON.stringify(blog)))
    jsonBlogs.forEach(blog => expect(blog.id).toBeDefined())
  })
})

describe('a new blog can be added', () => {
 
  test('a blog can\'t be added without an authentication token ', async () => {
    const newBlog = {
      title: 'New Test blog',
      author: 'Test user',
      content: 'This is a blog post added by the test',
      url: 'http://someurl.com',
      likes: '234'
    }

    const blogsInitial = await Blog.find({})

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogsUpdated = await Blog.find({})

    expect(blogsUpdated.length).toEqual(blogsInitial.length)
  })

  test('a new blog can be added', async () => {
    const initialBlogs = await Blog.find({}) 
    const newBlog = {
      title: 'New Test blog',
      author: 'Test user',
      content: 'This is a blog post added by the test',
      url: 'http://someurl.com',
      likes: '234'
    }
    const savedBlog = await api.post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    const updatedBlogs = await Blog.find({})
    expect(updatedBlogs.length).toBe(initialBlogs.length + 1)
    expect(savedBlog.body.content).toBe('This is a blog post added by the test')
  })

  test('likes defaults to 0', async () => {
    const initialBlogs = await Blog.find({}) 
    const newBlog = {
      title: 'New Test blog',
      author: 'Test user',
      content: 'This is a blog post added by the test',
      url: 'http://someurl.com',
    }

    const savedBlog = await api.post('/api/blogs')
                              .set('Authorization', token)
                              .send(newBlog)
                              .expect(201)
                              .expect('Content-Type', /application\/json/)
    const updatedBlogs = await Blog.find({})

    expect(updatedBlogs.length).toBe(initialBlogs.length + 1)
    expect(Number(savedBlog.body.likes)).toBe(0)
  })

  test('blog can\'t be added without author or title', async () => {
    const initialBlogs = await Blog.find({})
    const newBlog = {
      content: 'This is a blog post added by the test',
      url: 'http://someurl.com',
    }

    const savedBlog = await api.post('/api/blogs')
                              .set('Authorization', token)
                              .send(newBlog)
                              .expect(400)
                              .expect('Content-Type', /application\/json/)
    const updatedBlogs = await Blog.find({})

    expect(updatedBlogs.length).toBe(initialBlogs.length)
  })
})
describe('blogs can be deleted', () => {
  
  test('a blog can be deleted', async () => {
    const user = await User.findOne({})
    const initialBlogs = await Blog.find({})
    const noteId = user.blogs[0]
    const note = await Blog.findById(noteId)
    await api.delete(`/api/blogs/${noteId}`)
            .set('Authorization', token)
            .expect(204)
    const updatedBlogs = await Blog.find({})
    expect(updatedBlogs.length).toBe(initialBlogs.length - 1)
  })
})
describe('blogs can be updated', () => {
  test('amount of likes can be updated', async () => {
    const user = await User.findOne({})
    console.log('Test USER', user)
    const blogId = user.blogs[0]
    const initialBlog = await Blog.findById(blogId)
    const updatedBlog = await api.put(`/api/blogs/${blogId}`)
                                  .expect(201)
    expect(Number(updatedBlog.body.likes)).toBe(Number(initialBlog.likes) + 1)
  })
})

afterAll( () => {
  mongoose.connection.close()
})