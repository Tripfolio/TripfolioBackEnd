const { pgTable, serial, varchar, date, text, boolean, timestamp } = require("drizzle-orm/pg-core");

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 10 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  gender: varchar('gender', { length: 10 }),
  phone: varchar('phone', { length: 20 }),
  birthday: date('birthday'),
  avatar: text('avatar'),
  isPremium: boolean("is_premium").default(false),
  created_at: timestamp("created_at", { precision: 2 }).defaultNow(),
  google_id: varchar('google_id', { length: 255 }).unique(),
});

module.exports = { users };