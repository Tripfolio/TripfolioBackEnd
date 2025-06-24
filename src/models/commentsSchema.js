const {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} = require("drizzle-orm/pg-core");
const { users } = require("./signUpSchema");

const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  memberId: integer("member_id").references(() => users.id),
  content: varchar("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

module.exports = { comments };
