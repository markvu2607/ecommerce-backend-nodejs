"use strict"

const JWT = require("jsonwebtoken")

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

module.exports = {
  createTokenPair
}
