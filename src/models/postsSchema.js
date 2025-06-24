const { pgTable, serial, integer, varchar, timestamp } = require('drizzle-orm/pg-core');

const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id').notNull(),
  scheduleId: integer('schedule_id').notNull(),
  coverURL: varchar('cover_url', { length: 2048 }),
  content: varchar('content', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

module.exports = { posts };
