const { pgTable, serial, varchar, date, timestamp, integer } = require('drizzle-orm/pg-core');

const schedules = pgTable('schedules', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  title: varchar('title', { length: 20 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  description: varchar('description', { length: 500 }),
  coverURL: varchar('cover_url', { length: 2048 }),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { schedules };
