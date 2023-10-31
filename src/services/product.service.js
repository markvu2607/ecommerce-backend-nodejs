"use strict"

const { product, electronic, clothing } = require("../models/product.model")
const { BadRequestError } = require("../core/error.response")
const {
  findAllDraftsForShop,
  findAllPublishedForShop,
  publishProductByShop,
  unpublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct
} = require("../models/repositories/product.repo")

class ProductFactory {

  static productRegistry = {}

  static registerProductType (type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct (type, payload) {
    const ProductClass = ProductFactory.productRegistry[type]

    if(!ProductClass) throw new BadRequestError(`Invalid Product type: ${type}`)

    return new ProductClass(payload).createProduct()
  }

  static async updateProduct (type, payload) {
    const ProductClass = ProductFactory.productRegistry[type]

    if(!ProductClass) throw new BadRequestError(`Invalid Product type: ${type}`)

    return new ProductClass(payload).createProduct()
  }

  static async findAllDraftsForShop ({product_shop, limit = 50, skip = 0}) {
    const query = {product_shop, isDraft: true}
    return await findAllDraftsForShop({query, limit, skip})
  }

  static async findAllPublishedForShop ({product_shop, limit = 50, skip = 0}) {
    const query = {product_shop, isPublished: true}
    return await findAllPublishedForShop({query, limit, skip})
  }

  static async publishProductByShop ({product_shop, product_id}) {
    return await publishProductByShop({product_shop, product_id})
  }

  static async unpublishProductByShop ({product_shop, product_id}) {
    return await unpublishProductByShop({product_shop, product_id})
  }

  static async getListSearchProduct ({keySearch}) {
    return await searchProductByUser({keySearch})
  }

  static async findAllProducts ({limit = 50, sort = 'ctime', page=1, filter={isPublished: true}}) {
    return await findAllProducts({limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb']})
  }

  static async findProduct ({product_id}) {
    return await findProduct({product_id, unSelect: ['__v']})
  }
}

class Product {
  constructor ({product_name, product_thumb, product_description, product_price,
     product_type, product_shop, product_attributes, product_quantity}) {
      this.product_name = product_name
      this.product_thumb = product_thumb
      this.product_description = product_description
      this.product_price = product_price
      this.product_type = product_type
      this.product_shop = product_shop
      this.product_attributes = product_attributes
      this.product_quantity = product_quantity
  }

  async createProduct (product_id) {
    return await product.create({...this, _id: product_id})
  }
}

class Clothing extends Product {
  async createProduct () {
    const newClothing = await clothing.create({...this.product_attributes, product_shop: this.product_shop})
    if(!newClothing) throw new BadRequestError("create new clothing error")

    const newProduct = await super.createProduct(newClothing._id)
    if(!newProduct) throw new BadRequestError("create new clothing error")

    return newProduct
  }
}

class Electronic extends Product {
  async createProduct () {
    const newElectronic = await electronic.create({...this.product_attributes, product_shop: this.product_shop})
    if(!newElectronic) throw new BadRequestError("create new electronic error")

    const newProduct = await super.createProduct(newElectronic._id)
    if(!newProduct) throw new BadRequestError("create new electronic error")

    return newProduct
  }
}

// register product type
ProductFactory.registerProductType("Clothing", Clothing)
ProductFactory.registerProductType("Electronic", Electronic)

module.exports = ProductFactory
