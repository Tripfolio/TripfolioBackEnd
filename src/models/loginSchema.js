const { pgTable, serial, varchar, date, text, timestamp } = require("drizzle-orm/pg-core");

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  gender: varchar('gender', { length: 10 }),
  phone: varchar('phone', { length: 20 }),
  birthday: date('birthday'),
  avatar: text('avatar'),
  created_at: timestamp("created_at", { precision: 2 }).defaultNow(),
});


module.exports = { users };