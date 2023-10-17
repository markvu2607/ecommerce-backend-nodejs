"use strict"

const apiKeyModel = require("../models/apikey.model")
// const  crypto = require("node:crypto")

const findById = async (key) => {
  // create fake api key
  // const newKey = await apiKeyModel.create({key: crypto.randomBytes(64).toString("hex"), permissions: ["API_KEY_FREE"]})
  // console.log(newKey)

  const objKey = await apiKeyModel.findOne({key, status: true}).lean()

  return objKey
}

module.exports = {
  findById
}
