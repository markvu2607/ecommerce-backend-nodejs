"use strict"

const express = require("express")
const { apiKey, permission } = require("../auth/checkAuth")
const asyncHandler = require("../helpers/asyncHandler")

const router = express.Router()

router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello world!!!"
  })
})

router.use(asyncHandler(apiKey))

router.use(asyncHandler(permission("API_KEY_FREE")))

router.use("/v1/api/auth", require("./access"))
router.use("/v1/api/product", require("./product"))

module.exports = router
