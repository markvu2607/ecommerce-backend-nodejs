"use strict"

const { ReasonPhrases, StatusCodes } = require("http-status-codes")

class SuccessResponse {
  constructor ({message, status = StatusCodes.OK, reasonPhrases = ReasonPhrases.OK, metadata = {}}) {
    this.message = !message ? reasonPhrases : message
    this.status = status
    this.metadata = metadata
  }

  send (res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor ({ message, metadata }) {
    super( { message, metadata } )
  }
}

class CREATED extends SuccessResponse {
  constructor ({ message, status = StatusCodes.CREATED, reasonPhrases = ReasonPhrases.CREATED , metadata }) {
    super( { message, status, reasonPhrases, metadata } )
  }
}

module.exports = {
  OK, CREATED
}
