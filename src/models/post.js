const { pgTable, serial, integer, text, timestamp } = require('drizzle-orm/pg-core');

const communityPosts = pgTable('community_posts', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id').notNull(),
  scheduleId: integer('schedule_id').notNull(),
  coverURL: text('cover_url'),
  content: text('content'), 
  createdAt: timestamp('created_at').defaultNow()
});

module.exports = { communityPosts };
