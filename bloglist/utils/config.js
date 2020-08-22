require('dotenv').config()
let MONGO_URL = process.env.MONGO_URL
if (process.env.NODE_ENV === 'test')
  MONGO_URL = process.env.MONGO_TEST

let PORT = process.env.PORT

module.exports = {
  MONGO_URL,
  PORT
}