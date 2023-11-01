"use strict"

const ProductService = require("../services/product.service")
const { CREATED, SuccessResponse } = require("../core/success.response")

class ProductController {
  createProduct = async (req, res, next) => {
    new CREATED({
      message: "Create new product success!",
      metadata: await ProductService.createProduct(req.body.product_type, {...req.body, product_shop : req.user.userId})
    }).send(res)
  }

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "updateProduct success!",
      metadata: await ProductService.updateProduct(req.body.product_type, req.params.product_id , { ...req.body, product_shop: req.user.userId })
    }).send(res)
  }

  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list draft success!",
      metadata: await ProductService.findAllDraftsForShop({ product_shop : req.user.userId})
    }).send(res)
  }

  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list publish success!",
      metadata: await ProductService.findAllPublishedForShop({ product_shop : req.user.userId})
    }).send(res)
  }

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish success!",
      metadata: await ProductService.publishProductByShop({ product_shop : req.user.userId, product_id: req.params.id})
    }).send(res)
  }

  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish success!",
      metadata: await ProductService.unpublishProductByShop({ product_shop : req.user.userId, product_id: req.params.id})
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search product!",
      metadata: await ProductService.getListSearchProduct(req.params)
    }).send(res)
  }

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list findAllProducts success!",
      metadata: await ProductService.findAllProducts(req.query)
    }).send(res)
  }

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "findProduct success!",
      metadata: await ProductService.findProduct({ product_id: req.params.product_id})
    }).send(res)
  }
}

module.exports = new ProductController()
