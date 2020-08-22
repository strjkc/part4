const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3

  },
  passwordHash: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

user.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString(),
    delete returned._id
    delete returned.__v
    delete returned.passwordHash
  }
})

user.plugin(uniqueValidator)

module.exports = mongoose.model('User', user)