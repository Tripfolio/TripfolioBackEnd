const { pgTable, serial, text, integer } = require('drizzle-orm/pg-core')

const itineraryPlaces = pgTable('itinerary_places', {
  id: serial('id').primaryKey(),
  itineraryId: integer('itinerary_id'),
  name: text('name'),
  address: text('address')
})

module.exports = {
  itineraryPlaces
}
