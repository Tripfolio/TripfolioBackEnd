const { pgTable, serial, varchar, date,  boolean, timestamp } = require('drizzle-orm/pg-core');

const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 10 }).notNull(),
  email: varchar('email', { length: 30 }).notNull().unique(),
  password: varchar('password', { length: 120 }),
  gender: varchar('gender', { length: 20 }),
  phone: varchar('phone', { length: 20 }),
  birthday: date('birthday'),
  avatar: varchar('avatar'),
  isPremium: boolean('is_premium').default(false),
  createdAt: timestamp('created_at', { precision: 2 }).defaultNow(),
  googleId: varchar('google_id', { length: 255 }).unique(),
});

module.exports = { users }; 