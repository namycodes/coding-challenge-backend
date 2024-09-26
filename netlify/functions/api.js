const express = require('express')
const Router = express.Router()
const serverless = require('serverless-http')

const api = express()

api.use('/api/', Router)

export const handler = serverless(api)