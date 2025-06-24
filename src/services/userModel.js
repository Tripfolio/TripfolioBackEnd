const { db } = require('../config/db');
const { users } = require('../models/usersSchema');
const { eq } = require('drizzle-orm');

const findByEmail = async (email) => {
  const usersData = await db.select().from(users).where(eq(users.email, email));
  return usersData[0] || null;
};

const createUser = ({ name, email, password }) => {
  return db.insert(users).values({ name, email, password }).returning({ id: users.id });
};

module.exports = {
  findByEmail,
  createUser,
}; 