const { pgTable, serial, text, integer, doublePrecision } = require('drizzle-orm/pg-core');
const { travelSchedules } = require('../models/scheduleSchema'); 

<<<<<<< HEAD
const itineraryPlaces = pgTable('itinerary_places', {
  id: serial('id').primaryKey(),
  itineraryId: integer('itinerary_id').references(() => travelSchedules.id, { onDelete: 'cascade' }),
  name: text('name'),
  address: text('address'),
  photo: text('photo'),
  arrivalHour: integer('arrival_hour'),
  arrivalMinute: integer('arrival_minute'),
  placeOrder: integer('place_order'),
  lat: doublePrecision("lat"),  
  lng: doublePrecision("lng"),
=======
const itineraryPlaces = pgTable("itinerary_places", {
  id: serial("id").primaryKey(),
  itineraryId: integer("itinerary_id"),
  name: text("name"),
  address: text("address"),
  photo: text("photo"),
  arrivalHour: integer("arrival_hour"),
  arrivalMinute: integer("arrival_minute"),
  placeOrder: integer("place_order"),
  date: text("date").notNull(),
>>>>>>> dev
});

module.exports = {
  itineraryPlaces,
};