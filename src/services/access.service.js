"use strict"

const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("node:crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, UnauthorizedError, ForbiddenError } = require("../core/error.response")
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

    if(!match) throw new UnauthorizedError("Authentication error!")

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
    return await KeyTokenService.removeKeyById(keyStore._id)
  }

  static handleRefreshToken = async ({refreshToken, user, keyStore}) => {
    const {userId, email} = user;

    if(keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId)
      throw new ForbiddenError("Something went wrong! Please relogin!")
    }

    if(keyStore.refreshToken !== refreshToken) throw new UnauthorizedError("Shop is not registered!")

    const foundShop = await ShopService.findByEmail({email})

    if(!foundShop) throw new UnauthorizedError("Shop is not registered!")

    const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return {
      user,
      tokens
    }
  }
}

module.exports = AccessService
