import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core'
export const entries = pgTable('entries', {
  id: serial().primaryKey(),
  title: text().notNull(),
  kind: text().notNull(),
  category: text().notNull(),
  description: text().notNull().default(''),
  content: text().notNull().default(''),
  image: text().notNull().default(''),
  url: text().notNull().default(''),
  steps: text().notNull().default('[]'),
  script: text().notNull().default(''),
  favorite: boolean().notNull().default(false),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
