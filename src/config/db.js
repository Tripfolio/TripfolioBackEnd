const { drizzle } = require('drizzle-orm/node-postgres')
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  options: '-c timezone=Asia/Taipei'
})

const db = drizzle(pool)

module.exports = { db }
