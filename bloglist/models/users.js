const mongoose = require('mongoose')

const user = new mongoose.Schema({
  name: {
    type: String
  },
  username: {
    type: String
  },
  passwordHash: {
    type: String
  }
})

user.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString(),
    delete returned._id
    delete returned.__v
    delete returned.passwordHash
  }
})

module.exports = mongoose.model('User', user)