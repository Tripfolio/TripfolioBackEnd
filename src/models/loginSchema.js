const { pgTable, serial, varchar, timestamp } = require("drizzle-orm/pg-core");

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  created_at: timestamp("created_at", { precision: 2 }).defaultNow(),
});

module.exports = { users };
