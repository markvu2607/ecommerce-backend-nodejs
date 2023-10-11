"use strict"

const mongoose = require("mongoose")
const os = require("os")
const process = require("process")

const countConnect = () => {
  const numConnection = mongoose.connections.length

  return numConnection
}

const checkOverload = () => {
  // bug: still interval when exit server
  // setInterval(() => {
  //   const numConnection = countConnect()
  //   const numCores = os.cpus().length
  //   const memoryUsage = process.memoryUsage().rss

  //   const maxConnections = numCores * 5;

  //   console.log(`Connections: ${numConnection}/${maxConnections}`)
  //   console.log("Memory use: ", memoryUsage / 1024 / 1024, "MB")

  //   if(numConnection > maxConnections) {
  //     console.log("Connection overload detected!")
  //     // notify when overload.
  //   }
  //  }, 5000)
}

module.exports = {
  countConnect,
  checkOverload
}
