const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')

//Route files
const bootcampsRoute = require('./routes/bootcamps')

//load env vars
dotenv.config({ path: './config/config.env'})

const app = express()

//Dev logging middleware
if(process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
}


//Mount Routers
app.use('/app/v1/bootcamps', bootcampsRoute)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`))