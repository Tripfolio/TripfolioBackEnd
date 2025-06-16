const { pgTable, serial, text, integer, varchar } = require('drizzle-orm/pg-core');

const itineraryPlaces = pgTable('itinerary_places', {
  id: serial('id').primaryKey(),
  itineraryId: integer('itinerary_id').references(() => travelSchedules.id, { onDelete: 'cascade' }),
  name: text('name'),
  address: text('address'),
  photo: text('photo'),
  arrivalHour: integer('arrival_hour'),
  arrivalMinute: integer('arrival_minute'),
  placeOrder: integer('place_order'),
});

module.exports = {
  itineraryPlaces,
};