const errorHandler = (error, request, response, next) => {
  console.log(error)
  if (error.name === 'ValidationError')
    return response.status(400).send({ error: error.message })
  next()
}

const invalidPath = (request, response) => {
  response.status(404).send({error: 'Unknown endpoint'})
}

const extractToken = (request) => {
  const rawToken = request.get('authorization')
  console.log('rawToken', rawToken)
  if (rawToken && rawToken.toLowerCase().startsWith('bearer '))
    return rawToken.substring(7)
  return null
}

module.exports = {
  errorHandler,
  invalidPath,
  extractToken
}