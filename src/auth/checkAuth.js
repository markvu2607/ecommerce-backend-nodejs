"use strict"

const { ForbiddenRequestError } = require("../core/error.response")
const {findById} = require("../services/apiKey.service")

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization"
}

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString()

  if(!key) {
    throw new ForbiddenRequestError("Forbidden error!")
  }

  const objKey = await findById(key)

  if(!objKey) {
    throw new ForbiddenRequestError("Forbidden error!")
  }

  req.objKey = objKey

  return next()
}


const permission = (permission) => {
  return async (req, res, next) => {
    if(!req.objKey.permissions) {
      throw new ForbiddenRequestError("Forbidden error!")
    }

    const validPermission = req.objKey.permissions.includes(permission)

    if(!validPermission) {
      throw new ForbiddenRequestError("Forbidden error!")
    }

    return next()
  }
}

const asyncHandler = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

module.exports = {
  apiKey,
  permission,
  asyncHandler
}
