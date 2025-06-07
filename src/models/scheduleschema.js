const { pgTable, serial, text, varchar, date, timestamp, integer } = require('drizzle-orm/pg-core');

const schedules = pgTable('schedules', {
    id: serial('id').primaryKey(),
    memberId: integer('member_id').notNull(),
    title: varchar('title', { length: 10 }),
    phone: varchar('phone', { length: 20 }),
    email: varchar('email', { length:100 }),
    birthday: date('birthday'),
    password: varchar('password', { length:100 }),
    avatar: text('avatar'),
});

module.exports = { members };