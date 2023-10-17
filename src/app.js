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

// Handling not found
app.use((req, res, next) => {
  const error = new Error("Not Found")
  error.status = 404
  next(error)
})

// Handling error
app.use((error, req, res, next) => {
  const status = error.status || 500

  return res.status(status).json({
    status,
    message: error.message || "Internal Server Error"
  })
})

module.exports = app
