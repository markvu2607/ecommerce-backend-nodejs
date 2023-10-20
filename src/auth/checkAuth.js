"use strict"

const { ForbiddenError } = require("../core/error.response")
const {findById} = require("../services/apiKey.service")
const { HEADER } = require("./constants")



const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString()

  if(!key) {
    throw new ForbiddenError("Forbidden error!")
  }

  const objKey = await findById(key)

  if(!objKey) {
    throw new ForbiddenError("Forbidden error!")
  }

  req.objKey = objKey

  return next()
}


const permission = (permission) => {
  return async (req, res, next) => {
    if(!req.objKey.permissions) {
      throw new ForbiddenError("Forbidden error!")
    }

    const validPermission = req.objKey.permissions.includes(permission)

    if(!validPermission) {
      throw new ForbiddenError("Forbidden error!")
    }

    return next()
  }
}

module.exports = {
  apiKey,
  permission
}
