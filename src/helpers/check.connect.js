"use strict"

const mongoose = require("mongoose")
const os = require("os")
const process = require("process")

const countConnect = () => {
  const numConnection = mongoose.connections.length

  return numConnection
}

const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss

    const maxConnections = numCores * 5;

    console.log(numConnection, maxConnections)
    console.log("Memory use: ", memoryUsage / 1024 / 1024, "MB")

    if(numConnection > maxConnections) {
      console.log("Connection overload detected!")
      // notify when overload.
    }
   }, 5000)
}

module.exports = {
  countConnect,
  checkOverload
}
