<<<<<<< HEAD
const db = require("../config/db");
const { users } = require("./schema");
const { eq } = require("drizzle-orm");

const findByEmail = async (email) => {
	const usersData = await db
		.select()
		.from(users)
		.where(eq(users.email, email));
	return usersData[0] || null;
};

module.exports = {
	findByEmail,
};
=======
const db = require('../config/db');
const { users } = require('./schema');
const { eq } = require('drizzle-orm');
const findByEmail = async (email) => {
	const usersData = await db
		.select()
		.from(users)
		.where(eq(users.email, email));
	return usersData[0] || null;
};

const createUser = async ({ email, password, phone }) => {
	return await db.insert(users).values({
		email,
		password,
		phone,
	});
};

module.exports = {
	findByEmail,
	createUser,
};
>>>>>>> 2e3c5008a3433fac8bbd1d2eb0d2d748e7ce7d12
