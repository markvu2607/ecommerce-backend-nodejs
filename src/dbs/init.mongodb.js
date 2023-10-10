"use strict"

const mongoose = require("mongoose")
const { countConnect } = require("../helpers/check.connect")

const connectString = "mongodb://localhost:27017"

class Database {
  constructor() {
    this.connect()
  }

  connect() {
    mongoose.set("debug", true)
    mongoose.set("debug", {color: true})

    mongoose.connect(connectString, {maxPoolSize: 10})
      .then(() => console.log("Connected mongodb success. Connections:", countConnect()))
      .catch(err => console.log("Connect error"))
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

module.exports = Database.getInstance()
