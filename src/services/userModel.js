const { db } = require('../config/db');
const { users } = require('../models/usersSchema');
const { eq } = require('drizzle-orm');

const findByEmail = async (email) => {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0] || null;
};

const findById = async (id) => {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0] || null;
};

const createUser = async ({ name, email, password, googleId = null }) => {
  return await db
    .insert(users)
    .values({
      name,
      email,
      password,
      googleId,
    })
    .returning();
};

const updateGoogleId = async (userId, googleId) => {
  return await db
    .update(users)
    .set({ googleId })
    .where(eq(users.id, userId));
};

const findOrCreateGoogleUser = async ({ googleId, email, name }) => {
  const byGoogleId = await db
    .select()
    .from(users)
    .where(eq(users.googleId, googleId));

  if (byGoogleId.length > 0) {
    return byGoogleId[0];
  }

  const byEmail = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (byEmail.length > 0) {
    const user = byEmail[0];
    await updateGoogleId(user.id, googleId);
    return { ...user, googleId };
  }

  const newUser = await db
    .insert(users)
    .values({
      name,
      email,
      password: null,
      googleId,
    })
    .returning();

  return newUser[0];
};

const setPasswordByEmail = async (email, hashedPassword) => {
  return await db
    .update(users)
    .set({ password: hashedPassword })
    .where(eq(users.email, email));
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateGoogleId,
  findOrCreateGoogleUser,
  setPasswordByEmail,
};
