const { pgTable, serial, integer, varchar, timestamp } = require('drizzle-orm/pg-core');
const { schedules } = require('./scheduleSchema');
const { users } = require('./usersSchema');

// 行程分享連結 table
const tripShares = pgTable('trip_shares', {
  id: serial('id').primaryKey(),
  tripId: integer('trip_id')
    .notNull()
    .references(() => schedules.id),
  token: varchar('token').notNull().unique(), // 分享連結唯一 token（由 UUID/JWT 產生）
  permission: varchar('permission').notNull(), // 'viewer' 或 'editor'
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// 被共享者的權限記錄 table
const sharedUsers = pgTable('shared_users', {
  id: serial('id').primaryKey(),
  tripId: integer('trip_id')
    .notNull()
    .references(() => schedules.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  role: varchar('role').notNull(), // 'viewer' 或 'editor'
  addedBy: integer('added_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

module.exports = {
  tripShares,
  sharedUsers,
};
