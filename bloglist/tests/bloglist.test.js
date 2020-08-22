const listHelper = require('../utils/list_helper')
const User = require('../models/users')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const api = supertest(app)

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
    // strahinja: 4000 marko: 300 me: 10
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({ author: 'Strahinja', total: 4000 })
  })
})

describe('Test user creation', () => {
  beforeEach( async () => {
    await User.deleteMany({})
    const passHash = await bcrypt.hash('root', 10)
    const firstUser = new User({
      name: 'root',
      username: 'root',
      passwordHash: passHash
    })
    await firstUser.save()
  })
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

afterAll( () => {
  mongoose.connection.close()
})