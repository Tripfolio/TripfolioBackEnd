const db = require("../config/db");
const { users } = require("./signUpSchema");
const { eq } = require("drizzle-orm");

const findByEmail = async (email) => {
  const usersData = await db.select().from(users).where(eq(users.email, email));
  return usersData[0] || null;
};

const findById = async (id) => {
  const usersData = await db.select().from(users).where(eq(users.id, id));
  return usersData[0] || null;
};

const createUser = async ({ name, email, password, googleId = null }) => {
  return await db.insert(users).values({
    name: name,
    email: email,
    password: password,
    google_id: googleId,
  }).returning();
};

const updateGoogleId = async (userId, googleId) => {
  await db.update(users).set({ google_id: googleId }).where(eq(users.id, userId));
};

const findOrCreateGoogleUser = async ({ googleId, email, name }) => {
  let existingUser = await db.select().from(users).where(eq(users.google_id, googleId));
  if (existingUser.length > 0) {
    return existingUser[0];
  }

  existingUser = await db.select().from(users).where(eq(users.email, email));
  if (existingUser.length > 0) {
    const userToUpdate = existingUser[0];
    await updateGoogleId(userToUpdate.id, googleId);
    return { ...userToUpdate, google_id: googleId };
  }

  const newUserResult = await db.insert(users).values({
    name: name,
    email: email,
    password: null,
    google_id: googleId,
  }).returning();

  return newUserResult[0];
};

module.exports = {
  findByEmail,
  findById,
  createUser,
  updateGoogleId,
  findOrCreateGoogleUser,
};