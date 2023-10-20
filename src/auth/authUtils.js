"use strict"

const JWT = require("jsonwebtoken")
const { HEADER } = require("./constants")
const KeyTokenService = require("../services/keyToken.service")
const { NotFoundError, AuthFailureError } = require("../core/error.response")

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
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if(!accessToken) throw new AuthFailureError("Invalid Request")

  const userId = req.headers[HEADER.CLIENT_ID]
  if(!userId) throw new AuthFailureError("Invalid Request")

  const keyStore = await KeyTokenService.findByUserId(userId)
  if( !keyStore) throw new NotFoundError("Not found keyStore")

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if(userId !== decodeUser.userId) throw new AuthFailureError("Invalid userId")

    req.keyStore = keyStore

    return next()
  } catch (error) {
    throw error
  }
}

module.exports = {
  createTokenPair,
  authentication
}
