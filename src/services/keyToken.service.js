"use strict"

const keyTokenModel = require("../models/keytoken.model")

class KeyTokenService {
  static createKeyToken = async ({userId, publicKey, privateKey}) => {
    try {
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey,
        privateKey
      })
      return tokens ? tokens.publicKey : null
    } catch (error) {

    }
  }
}

module.exports = KeyTokenService
