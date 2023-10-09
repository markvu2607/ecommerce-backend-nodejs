const compression = require("compression")
const express = require("express")
const { default: helmet } = require("helmet")
const morgan = require("morgan")

const app = express()

// Middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

// DB

// Routes
app.get("/", (req,res, next) => {
  return res.status(200).json({
    message: "Welcome!",
    metadata: "Welcome ".repeat(100000)
  })
})

// Handling error


module.exports = app
