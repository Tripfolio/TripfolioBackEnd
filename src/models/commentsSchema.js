const {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
} = require("drizzle-orm/pg-core");
const { users } = require("./signUpSchema");

const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  memberId: integer("member_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

module.exports = { comments };
