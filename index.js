import { pgTable, serial, text, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 256 }).notNull().unique(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password_hash: text('password_hash').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  profile_picture: text('profile_picture'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const emailPreferences = pgTable('email_preferences', {
  id: serial('id').primaryKey(),
  member_id: serial('member_id').unique().notNull(),
  marketing_emails: boolean('marketing_emails').default(true).notNull(),
  newsletter: boolean('newsletter').default(true).notNull(),
  product_updates: boolean('product_updates').default(true).notNull(),
});