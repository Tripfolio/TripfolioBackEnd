import dotenv from 'dotenv'
dotenv.config()

export default {
  schema: './src/models/schema.js', 
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL, 
  },
}
