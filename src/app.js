const compression = require("compression")
const express = require("express")
const { default: helmet } = require("helmet")
const morgan = require("morgan")
require("dotenv").config()

const app = express()

// Middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

// DB
require("./dbs/init.mongodb")

// Routes
app.use("", require("./routes"))

// Handling error


module.exports = app
