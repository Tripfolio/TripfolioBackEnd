const { pgTable, varchar, serial, integer, timestamp } = require ('drizzle-orm/pg-core');

const trafficData = pgTable("traffic_data", {
  id: serial('id').primaryKey(),
  itineraryId: integer('itinerary_id'),
  fromPlaceId: varchar("from_place_id", { length: 255 }).notNull(),
  toPlaceId: varchar("to_place_id", { length: 255 }).notNull(),
  transportMode: varchar("transport_mode", { length: 20 }).notNull(), 
  duration: integer("duration").notNull(), 
  distance: integer("distance"), 
});

module.exports = {
  trafficData
}