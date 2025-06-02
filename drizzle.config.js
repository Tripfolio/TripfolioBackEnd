const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	schema: './src/models/schema.js',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
};
