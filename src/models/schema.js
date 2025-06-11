<<<<<<< HEAD
const { pgTable, serial, varchar, timestamp } = require('drizzle-orm/pg-core');

const users = pgTable('users', {
	id: serial('id').primaryKey(),
	email: varchar('email', { length: 100 }).notNull().unique(),
	password: varchar('password', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 20 }).notNull(),
	created_at: timestamp('created_at', { precision: 2 }).defaultNow(),
});

module.exports = { users };
=======
const { pgTable, serial, varchar, text, date } = require('drizzle-orm/pg-core');

const members = pgTable('members', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }),
    gender: varchar('gender', { length: 10 }),
    phone: varchar('phone', { length: 20 }),
    email: varchar('email', { length:100 }),
    birthday: date('birthday'),
    password: varchar('password', { length:100 }),
    avatar: text('avatar'),
});

module.exports = { members };

>>>>>>> 2e3c5008a3433fac8bbd1d2eb0d2d748e7ce7d12
