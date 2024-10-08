const express = require('express')
const app = express()
const UsersRouter = require('./routes/users/usersRouter')
const WeatherRouter = require('./routes/weather/weatherRoute')
const cors = require('cors')
const morgan = require('morgan')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const {options} = require('./swagger')


const specs = swaggerJsDoc(options);

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.use(express.json())
app.use(cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
app.use('/api/v1/auth', UsersRouter)
app.use('/api/v1/weather',WeatherRouter)
module.exports = app