const { db } = require("../config/db");
const { users } = require("./signUpSchema");
const { eq } = require("drizzle-orm");
const findByEmail = async (email) => {
  const usersData = await db.select().from(users).where(eq(users.email, email));
  return usersData[0] || null;
};

const createUser = async ({ name, email, password }) => {
  return await db.insert(users).values({
    name,
    email,
    password,
  });
};

module.exports = {
  findByEmail,
  createUser,
};
