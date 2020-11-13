const express = require("express");
const dotenv = require("dotenv");   //install 
const morgan = require("morgan");   //install 
const colors = require('colors')   //install 
const connectDB = require("./config/db");

const errorHandler = require('./middleware/error')

//load env vars
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

//Route files
const bootcampsRoute = require("./routes/bootcamps");

const app = express();

//req body parser
app.use(express.json())

//Dev logging middleware
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

//Mount Routers
app.use("/app/v1/bootcamps", bootcampsRoute);

//errorHandler middleware Has to be below, the Router as Router ke next mei errorH ho --> router mei next(err) ho toh is middleware pe aaye
app.use(errorHandler)

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT, 
  console.log(`server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold)
);

//Handle unhandled rejections from throughout program
process.on('unhandledRejection', (error, promise) => {
    console.log(`Error Message: ${error.message}`.red)

    //close server and exit process
    server.close(() => process.exit(1)) 
}) 
