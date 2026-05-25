import { pgTable, serial, text, integer, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const statusEnum = pgEnum('status', ['to_watch', 'watching', 'watched']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 255 }),
  role: userRoleEnum('role').default('user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  year: integer('year'),
  director: varchar('director', { length: 255 }),
  genre: varchar('genre', { length: 255 }),
  posterUrl: text('poster_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userMovies = pgTable('user_movies', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  movieId: integer('movie_id').notNull().references(() => movies.id, { onDelete: 'cascade' }),
  status: statusEnum('status').default('to_watch').notNull(),
  rating: integer('rating'),
  review: text('review'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userMoviesRelations = relations(userMovies, ({ one }) => ({
  user: one(users, {
    fields: [userMovies.userId],
    references: [users.id],
  }),
  movie: one(movies, {
    fields: [userMovies.movieId],
    references: [movies.id],
  }),
}));
