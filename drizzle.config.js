const dotenv = require('dotenv');
dotenv.config();
module.exports = defineConfig({
  out: "./src/drizzle",
  schema: "./src/models",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

