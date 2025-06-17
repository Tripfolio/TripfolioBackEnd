const { db } = require("../config/db");
const { users } = require("./signUpSchema");
const { eq } = require("drizzle-orm");
const findByEmail = async (email) => {
  const usersData = await db.select().from(users).where(eq(users.email, email));
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
