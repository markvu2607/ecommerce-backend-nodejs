"use strict"

const { StatusCodes, ReasonPhrases } = require("http-status-codes")

class ErrorResponse extends Error {
  constructor (message, status) {
    super(message)
    this.status = status
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor (message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
    super(message, status)
  }
}

class BadRequestError extends ErrorResponse {
  constructor (message = ReasonPhrases.BAD_REQUEST, status = StatusCodes.BAD_REQUEST) {
    super(message, status)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError
}
