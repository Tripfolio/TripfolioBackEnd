const { pgTable, serial, text, integer, varchar } = require('drizzle-orm/pg-core');

const itineraryPlaces = pgTable('itinerary_places', {
  id: serial('id').primaryKey(),
  itineraryId: integer('itinerary_id'),
  name: text('name'),
  address: text('address'),
  photo: text('photo'),
  arrivalHour: integer('arrival_hour'),
  arrivalMinute: integer('arrival_minute'),
  placeOrder: integer('place_order'),
  selectedTransportMode: varchar('selected_transport_mode', { length: 20 }).default('walking')
});

module.exports = {
  itineraryPlaces,
};