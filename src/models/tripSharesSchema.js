const { pgTable, serial, varchar, integer, timestamp } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');
const { users } = require('./usersSchema');
const { schedules: trips } = require('./scheduleSchema');

const tripShares = pgTable('trip_shares', {
  id: serial('id').primaryKey(),

  tripId: integer('trip_id')
    .notNull()
    .references(() => trips.id, { onDelete: 'cascade' }),

  sharedWithUserId: integer('shared_with_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  sharedByUserId: integer('shared_by_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  permission: varchar('permission').notNull(),
  token: varchar('token').notNull().unique(),

  createdAt: timestamp('created_at').defaultNow(),
});

const tripSharesRelations = relations(tripShares, ({ one }) => ({
  user: one(users, {
    fields: [tripShares.sharedWithUserId],
    references: [users.id],
  }),
  trip: one(trips, {
    fields: [tripShares.tripId],
    references: [trips.id],
  }),
}));

module.exports = {
  tripShares,
  tripSharesRelations,
};
