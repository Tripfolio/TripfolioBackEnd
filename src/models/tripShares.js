const {
  pgTable,
  uuid,
  serial,
  text,
  integer,
  timestamp,
} = require("drizzle-orm/pg-core");
const { relations } = require("drizzle-orm");
const { users } = require("../models/signUpSchema");
const { travelSchedules: trips } = require("../models/scheduleSchema");

const tripShares = pgTable("trip_shares", {
  id: serial("id").primaryKey(),

  tripId: integer("trip_id")
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),

  sharedWithUserId: integer("shared_with_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  sharedByUserId: integer("shared_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  permission: text("permission").notNull(),
  token: text("token").notNull().unique(),

  createdTime: timestamp("created_time").defaultNow(),
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
