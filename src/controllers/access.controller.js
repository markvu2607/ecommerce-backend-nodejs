"use strict"

const AccessService = require("../services/access.service")
const { CREATED, SuccessResponse } = require("../core/success.response")

class AccessController {

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    }).send(res)
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered ok",
      metadata: await AccessService.signUp(req.body)
    }).send(res)
  }
}

module.exports = new AccessController()
