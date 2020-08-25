const errorHandler = (error, request, response, next) => {
  console.log(error)
  if (error.name === 'ValidationError')
    return response.status(400).send({ error: error.message })
  next()
}

const invalidPath = (request, response) => {
  response.status(404).send({error: 'Unknown endpoint'})
}

const extractToken = (request, response, next) => {
  const rawToken = request.get('authorization')
  if (rawToken)
    {
      request.token = rawToken.substring(7)
      console.log(request.token)
    }
    
  next()
}

module.exports = {
  errorHandler,
  invalidPath,
  extractToken
}