"use strict"

const { product, electronic, clothing } = require("../../models/product.model")
const {Types: {ObjectId}} = require("mongoose")

const queryProduct = async ({ query, limit, skip }) => {
  return await product.find( query )
  .populate("product_shop", "name email -_id")
  .sort({updateAt: -1})
  .skip(skip)
  .limit(limit)
  .lean()
  .exec()
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({keySearch}) => {
  const regexSearch = new RegExp(keySearch)

  const result = await product.find({
    isPublished: true,
    $text: { $search: regexSearch }
  }, {score: {$meta: 'textScore'}})
  .sort({score: {$meta: 'textScore'}}).lean()

  return result
}

const publishProductByShop = async ({product_shop, product_id}) => {
  const foundShop = await product.findOne({
    product_shop: new ObjectId(product_shop),
    _id: new ObjectId(product_id)
  })

  if(!foundShop) return null

  foundShop.isDraft = false
  foundShop.isPublished = true

  const { modifiedCount } = await foundShop.updateOne(foundShop)

  return modifiedCount
}

const unpublishProductByShop = async ({product_shop, product_id}) => {
  const foundShop = await product.findOne({
    product_shop: new ObjectId(product_shop),
    _id: new ObjectId(product_id)
  })

  if(!foundShop) return null

  foundShop.isDraft = true
  foundShop.isPublished = false

  const { modifiedCount } = await foundShop.updateOne(foundShop)

  return modifiedCount
}

module.exports = {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unpublishProductByShop,
  searchProductByUser
}
