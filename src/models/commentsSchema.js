const {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
} = require("drizzle-orm/pg-core");
const { members } = require("./schema");

const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

module.exports = { comments };
