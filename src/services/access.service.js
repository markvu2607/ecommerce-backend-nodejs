"use strict"

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("node:crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError } = require("../core/error.response")

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN"
}

class AccessService {

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
        return {
          code: "XXXXX",
          message: "keyStore error!"
        }
      }

      const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)

      return {
        code: "200",
        message: {
          shop: getInfoData({fields: ["_id", "name","email"], object: newShop}),
          tokens
        }
      }
    }

    return {
      code: 200,
      metadata: null
    }
  }
}

module.exports = AccessService
