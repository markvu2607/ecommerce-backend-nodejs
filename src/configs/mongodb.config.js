"use strict"

const dev = {
  app: {
     port: process.env.DEV_APP_PORT || 8000
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || ""
  }
}

const production = {
  app: {
    port: process.env.PRODUCTION_APP_PORT
 },
 db: {
   host: process.env.PRODUCTION_DB_PORT,
   port: process.env.PRODUCTION_DB_HOST,
   name: process.env.PRODUCTION_DB_NAME
 }
}

const config = {dev, production}

const env = process.env.ENVIRONMENT || "dev"

module.exports = config[env]
