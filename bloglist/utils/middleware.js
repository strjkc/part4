const logger = require('./logger')
const errorHandler = (error, request, response, next) => {
  console.log(error)
  if (error.name === 'ValidationError')
    return response.status(400).send({ error: 'Validation error, required property is missing' })
  if(error.name === 'JsonWebTokenError')
    return response.status(401).send({error: 'Invalid Token'})
  logger.error(error.message)
  next()
}

const invalidPath = (request, response) => {
  response.status(404).send({error: 'Unknown endpoint'})
}

const extractToken = (request, response, next) => {
  const rawToken = request.get('authorization')
  if (rawToken)
    {
      request.token = rawToken.substring(7).trim()
    }
    
  next()
}

module.exports = {
  errorHandler,
  invalidPath,
  extractToken
}