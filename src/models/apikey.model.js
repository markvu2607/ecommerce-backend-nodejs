"use strict"

const {Schema, model} = require("mongoose")

const DOCUMENT_NAME = "ApiKey"
const COLLECTION_NAME = "ApiKeys"

const apiKeySchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: Boolean,
    default: true,
  },
  permissions: {
    type: [String],
    required: true,
    enum: ["XXXXX", "API_KEY_FREE"]
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, apiKeySchema)
