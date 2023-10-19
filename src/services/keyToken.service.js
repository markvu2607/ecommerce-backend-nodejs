"use strict"

const keyTokenModel = require("../models/keytoken.model")

class KeyTokenService {
  static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })

      const filter = {user: userId}
      const update = {
        publicKey, privateKey, refreshToken: [], refreshToken
      }
      const options = {upsert: true, new: true}

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update , options)

      return tokens ? tokens.publicKey : null

  }
}

module.exports = KeyTokenService
