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