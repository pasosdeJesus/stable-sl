import fs from 'fs'
import 'dotenv/config'

export default {
  "development": {
    "username": process.env.DB_DEV_USER,
    "password": process.env.DB_DEV_PASSWORD,
    "database": process.env.DB_DEV,
    "host": "127.0.0.1",
    "dialect": "postgresql"
  },
  "test": {
    "username": process.env.DB_TEST_USER,
    "password": process.env.DB_TEST_PASSWORD,
    "database": process.env.DB_TEST,
    "host": "127.0.0.1",
    "dialect": "postgresql"
  },
  "production": {
    "username": process.env.DB_PROD_USER,
    "password": process.env.DB_PROD_PASSWORD,
    "database": process.env.DB_PROD,
    "host": "127.0.0.1",
    "dialect": "postgresql"
  }
}
