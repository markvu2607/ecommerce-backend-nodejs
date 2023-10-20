"use strict"

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("node:crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError } = require("../core/error.response")
const ShopService = require("./shop.service")

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN"
}

class AccessService {

  static login = async ({email, password, refreshToken = null}) => {
    const foundShop = await ShopService.findByEmail({ email })

    if(!foundShop) throw new BadRequestError("Shop not registered!")

    const match = await bcrypt.compare( password, foundShop.password)

    if(!match) throw new AuthFailureError("Authentication error!")

    const privateKey = crypto.randomBytes(64).toString("hex")
    const publicKey = crypto.randomBytes(64).toString("hex")

    const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey)

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId: foundShop._id
    })

    return {
      shop: getInfoData({fields: ["_id", "name","email"], object: foundShop}),
      tokens
    }
  }

  static signUp = async ({name, email, password}) => {
    const holderShop = await shopModel.findOne({ email }).lean()

    if(holderShop) {
      throw new BadRequestError("Shop already registered!")
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newShop = await shopModel.create({
      name, email, password: passwordHash, roles: [RoleShop.SHOP]
    })

    if(newShop) {
      const privateKey = crypto.randomBytes(64).toString("hex")
      const publicKey = crypto.randomBytes(64).toString("hex")

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey
      })

      if(!keyStore) {
        throw new BadRequestError("keyStore error!")
      }

      const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)

      return {
        shop: getInfoData({fields: ["_id", "name","email"], object: newShop}),
        tokens
      }
    }
  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id)

    console.log({delKey})

    return delKey
  }
}

module.exports = AccessService
