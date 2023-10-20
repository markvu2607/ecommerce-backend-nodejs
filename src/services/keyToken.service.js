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
    return await keyTokenModel.findOne({user:  new ObjectId(userId)}).lean()
  }

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({
      _id: new ObjectId(id)
    })
  }
}

module.exports = KeyTokenService
