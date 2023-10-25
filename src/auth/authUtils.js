"use strict"

const JWT = require("jsonwebtoken")
const { HEADER } = require("./constants")
const KeyTokenService = require("../services/keyToken.service")
const { NotFoundError, UnauthorizedError } = require("../core/error.response")

const createTokenPair = async (payload, publicKey, privateKey) => {
  const accessToken = await JWT.sign(payload, publicKey, {
    expiresIn: "2 days",
  })

  const refreshToken = await JWT.sign(payload, privateKey, {
    expiresIn: "7 days",
  })

  return {
    accessToken,
    refreshToken
  }
}

const authentication = async (req, res, next) => {

  const userId = req.headers[HEADER.CLIENT_ID]
  if(!userId) throw new UnauthorizedError("Invalid Request")

  const keyStore = await KeyTokenService.findByUserId(userId)
  if( !keyStore) throw new NotFoundError("Not found keyStore")

  // handle refresh token
  if(req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
      if(userId !== decodeUser.userId) throw new UnauthorizedError("Invalid userId")
      req.keyStore = keyStore
      req.user = decodeUser,
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      throw error
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if(!accessToken) throw new UnauthorizedError("Invalid Request")

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if(userId !== decodeUser.userId) throw new UnauthorizedError("Invalid userId")

    req.keyStore = keyStore
    req.user = decodeUser

    return next()
  } catch (error) {
    throw error
  }
}

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
}
