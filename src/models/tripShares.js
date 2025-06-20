const {
  pgTable,
  uuid,
  serial,
  text,
  timestamp,
} = require("drizzle-orm/pg-core");
const { relations } = require("drizzle-orm");
// const { users } = require("./users"); //需有users.js提供使用者的id
// const { trips } = require("./trips"); //需有trips.js提供行程的id

const tripShares = pgTable("trip_shares", {
  id: serial("id").primaryKey(),

  tripId: uuid("trip_id").notNull(),
  // .references(() => trips.id, { onDelete: "cascade" }),   //需有trips.js提供行程的id

  sharedWithUserId: uuid("shared_with_user_id").notNull(),
  // .references(() => users.id, { onDelete: "cascade" }),   //需有users.js提供使用者的id

  sharedByUserId: uuid("shared_by_user_id").notNull(),
  // .references(() => users.id, { onDelete: "cascade" }),  //需有users.js提供使用者的id

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
