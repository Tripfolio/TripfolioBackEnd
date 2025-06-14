const { pgTable, serial, varchar, text, date } = require("drizzle-orm/pg-core");

const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }),
  gender: varchar("gender", { length: 10 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  birthday: date("birthday"),
  password: varchar("password", { length: 100 }),
  avatar: text("avatar"),
});

module.exports = { members };
