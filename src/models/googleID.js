const { pgTable, varchar, timestamp } = require('drizzle-orm/pg-core');

const googleID = pgTable('googleID', {
    googleId: varchar('google_id', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow(),
});

module.exports = { googleID };