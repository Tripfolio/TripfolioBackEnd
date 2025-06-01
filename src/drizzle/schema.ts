import { pgTable, serial, integer, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const itineraryPlaces = pgTable("itinerary_places", {
	id: serial().primaryKey().notNull(),
	itineraryId: integer("itinerary_id"),
	name: text(),
	address: text(),
});
