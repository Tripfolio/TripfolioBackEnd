const { pgTable, serial, text, varchar, date, timestamp, integer } = require('drizzle-orm/pg-core');

const travelSchedules = pgTable('travel_schedules', {
    id: serial('id').primaryKey(),
    memberId: integer('member_id').notNull(),
    title: varchar('title', { length: 20 }).notNull(),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    description: text('description'),
    coverURL: text('cover_url'),
    createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { travelSchedules };