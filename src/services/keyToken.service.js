"use strict"

const keyTokenModel = require("../models/keytoken.model")
const { Types: {ObjectId} } = require("mongoose")

class KeyTokenService {
  static createKeyToken = async ({userId, publicKey, privateKey, refreshToken}) => {
      const filter = {user: userId}
      const update = {
        publicKey, privateKey, refreshToken: [], refreshToken
      }
      const options = {upsert: true, new: true}

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update , options)

      return tokens ? tokens.publicKey : null
  }

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({user:  new ObjectId(userId)})
  }

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({
      _id: new ObjectId(id)
    })
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({refreshTokensUsed: refreshToken}).lean()
  }

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({user: userId})
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({refreshToken})
  }
}

module.exports = KeyTokenService
