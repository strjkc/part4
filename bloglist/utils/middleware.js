const errorHandler = (error, request, response, next) => {
    console.log(error)
    if (error.name === 'ValidationError')
        return response.status(400).send({error: error.message})

    next()
    }

const invalidPath = (request, response) => {
    response.status(404).send({error: 'Unknown endpoint'})
}

module.exports = {
    errorHandler,
    invalidPath
}