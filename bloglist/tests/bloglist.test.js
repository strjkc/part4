const listHelper = require('../utils/list_helper')
const { TestResult } = require('@jest/types')
const { exportAllDeclaration } = require('@babel/types')

test('Dummy returns 1', () => {
    const blogs = []
    const result = listHelper(blogs)

    expect(result).toBe(1)
})