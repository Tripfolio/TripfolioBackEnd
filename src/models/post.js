const {
  pgTable,
  serial,
  integer,
  varchar,
  timestamp,
} = require("drizzle-orm/pg-core");

const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").notNull(),
  scheduleId: integer("schedule_id").notNull(),
  coverURL: varchar("cover_url"),
  content: varchar("content"),
  createdAt: timestamp("created_at").defaultNow(),
});

module.exports = { communityPosts };
