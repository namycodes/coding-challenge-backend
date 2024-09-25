const dontenv = require("dotenv")
dontenv.config({path: __dirname + '/config.env'})
const app = require('./app')
const mongoose = require('mongoose')
const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL



mongoose.connect(MONGO_URL).then(()=>{
    console.log('Connected to database')
}).catch(err=>{
    console.log(`An Error occured while connecting to the database ${err}`)
})

app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))