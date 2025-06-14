const { pgTable, serial, varchar, text, date } = require('drizzle-orm/pg-core');

const members = pgTable('members', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }),
    gender: varchar('gender', { length: 10 }),
    phone: varchar('phone', { length: 20 }),
    birthday: date('birthday'),
    avatar: text('avatar'),
});

module.exports = { members };