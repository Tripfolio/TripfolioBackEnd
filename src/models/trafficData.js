const { pgTable, serial, integer, varchar } = require('drizzle-orm/pg-core');
const { schedules } = require('./scheduleSchema'); 

const trafficData = pgTable("traffic_data", {
  id: serial('id').primaryKey(),
  itineraryId: integer('itinerary_id').references(() => schedules.id, { onDelete: 'cascade' }),
  fromPlaceId: integer("from_place_id").notNull(), 
  toPlaceId: integer("to_place_id").notNull(), 
  transportMode: varchar("transport_mode", { length: 20 }).notNull(), 
  duration: integer("duration").notNull(), 
  distance: integer("distance"), 
});

module.exports = {
  trafficData
}