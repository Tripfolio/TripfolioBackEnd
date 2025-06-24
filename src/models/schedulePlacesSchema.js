const { pgTable, serial, varchar, integer,date } = require('drizzle-orm/pg-core');

const schedulePlaces = pgTable('schedule_places', {
  id: serial('id').primaryKey(),
  scheduleId: integer('schedule_id'),
  name: varchar('name', { length: 100 }),
  address: varchar('address', { length: 255 }),
  photo: varchar('photo', { length: 2048 }),
  arrivalHour: integer('arrival_hour'),
  arrivalMinute: integer('arrival_minute'),
  placeOrder: integer('place_order'),
  date: date('date').notNull(),
});

module.exports = {
  schedulePlaces,
};
