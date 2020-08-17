const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumReducer = (sum, object) => sum + Number(object.likes)
  return blogs.reduce(sumReducer, 0)
}

const favoriteBlog = (blogs) => {
  const favoriteReducer = (initialBlog, object) => {
    if (Number(initialBlog.likes) < Number(object.likes))
      initialBlog = object
    return initialBlog
  }
  return blogs.reduce(favoriteReducer, blogs[0])
}

const mostBlogs = (blogs) => {
  let list = []
  let obj = _.countBy(blogs, 'author')
  Object.keys(obj).map(key => list.push({ author: key, count: obj[key] }))
  return _.maxBy(list, 'count')
}

const mostLikes = (blogs) => {
  const obj = _.groupBy(blogs, 'author')
  const sumReducer = (init, obj) => init + Number(obj.likes)
  return _.max(Object.keys(obj).map( key => { return { author: key, total: obj[key].reduce(sumReducer,0) } }))
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}