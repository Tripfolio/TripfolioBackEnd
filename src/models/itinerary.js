const { date } = require("drizzle-orm/mysql-core");
const {
  pgTable,
  serial,
  date,
  integer,
  varchar,
} = require("drizzle-orm/pg-core");

const itineraryPlaces = pgTable("itinerary_places", {
  id: serial("id").primaryKey(),
  itineraryId: integer("itinerary_id"),
  name: varchar("name"),
  address: varchar("address"),
  photo: varchar("photo"),
  arrivalHour: integer("arrival_hour"),
  arrivalMinute: integer("arrival_minute"),
  placeOrder: integer("place_order"),
  date: date("date").notNull(),
});

module.exports = {
  itineraryPlaces,
};
