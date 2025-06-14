const db = require('../config/db');
const { users } = require('./signUp'); 
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

const createGoogleUser = async (userData) => {
    const [insertedUser] = await db.insert(users)
        .values(userData)
        .returning({ // 返回所有你需要在 googleLogin.js 中使用的欄位
            id: users.id,
            email: users.email,
            name: users.name,
            googleId: users.googleId,
            phone: users.phone,
        });
    return insertedUser;
};

const update = async (userId, updates) => {
    const [updatedUser] = await db
        .update(users)
        .set(updates)
        .where(eq(users.id, userId))
        .returning({ // 返回更新後的使用者資訊
            id: users.id,
            email: users.email,
            name: users.name,
            googleId: users.googleId,
            phone: users.phone,
        });
    return updatedUser;
};

module.exports = {
	findByEmail,
	createUser,
	createGoogleUser, 
    update,
};
