const { pgTable, integer, boolean } = require("drizzle-orm/pg-core");
const { users } = require("./signUpSchema");

const emailPreferences = pgTable("email_preferences", {
  userId: integer("user_id")
    .primaryKey()
    .references(() => users.id),
  onRegister: boolean("on_register").notNull().default(true),
  onLogin: boolean("on_login").notNull().default(true),
  onLoginfail: boolean("on_loginfail").notNull().default(true),
  onComment: boolean("on_comment").notNull().default(true),
  onBookmark: boolean("on_bookmark").notNull().default(true),
});

module.exports = { emailPreferences };
