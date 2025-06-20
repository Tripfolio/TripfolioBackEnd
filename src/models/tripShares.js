const {
  pgTable,
  uuid,
  serial,
  text,
  timestamp,
} = require("drizzle-orm/pg-core");
const { relations } = require("drizzle-orm");
const { users } = require("./signUpSchema");
const { travelSchedules } = require("./scheduleSchema");

const tripShares = pgTable("trip_shares", {
  id: serial("id").primaryKey(),

  tripId: uuid("trip_id")
    .notNull()
    .references(() => travelSchedules.id, { onDelete: "cascade" }),

  sharedWithUserId: uuid("shared_with_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  sharedByUserId: uuid("shared_by_user_id")
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
  trip: one(travelSchedules, {
    fields: [tripShares.tripId],
    references: [travelSchedules.id],
  }),
}));

module.exports = {
  tripShares,
  tripSharesRelations,
};
