const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// 用 pool 建立 drizzle 實例
const db = drizzle(pool)

module.exports = { db }
