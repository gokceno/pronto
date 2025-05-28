// apps/web/db/schema.js
import {
    sqliteTable,
    text,
    integer,
    primaryKey,
    unique,
    index,
    foreignKey,
    blob,
  } from "drizzle-orm/sqlite-core";
  import { relations } from "drizzle-orm";
  import { sql } from "drizzle-orm";
  
  // Helper for timestamps
  const now = () => sql`CURRENT_TIMESTAMP`;
  
  // USERS
  export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    avatar: text("avatar"),
    isDeleted: integer("is_deleted").notNull().default(0),
    createdAt: text("created_at").default(now()),
  });
  
  // COUNTRIES
  export const countries = sqliteTable("countries", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    code: text("code").notNull(),
    isDeleted: integer("is_deleted").notNull().default(0),
    createdAt: text("created_at").default(now()),
  });
  
  // GENRES
  export const genres = sqliteTable("genres", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    isDeleted: integer("is_deleted").notNull().default(0),
    createdAt: text("created_at").default(now()),
  });
  
  // RADIOS
  export const radios = sqliteTable("radios", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    favicon: text("favicon"),
    countryId: integer("country_id").references(() => countries.id),
    isDeleted: integer("is_deleted").notNull().default(0),
    createdAt: text("created_at").default(now()),
  });
  
  // RADIO-GENRES (Many-to-many)
  export const radioGenres = sqliteTable("radio_genres", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    radioId: text("radio_id").notNull().references(() => radios.id),
    genreId: integer("genre_id").notNull().references(() => genres.id),
    createdAt: text("created_at").default(now()),
  });
  
  // RADIO-LISTS (User-created lists)
  export const radioLists = sqliteTable("radio_lists", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull().references(() => users.id),
    name: text("name").notNull(),
    isDeleted: integer("is_deleted").notNull().default(0),
    createdAt: text("created_at").default(now()),
  });
  
  // RADIO-LIST-RADIOS (Many-to-many: radios in lists)
  export const radioListRadios = sqliteTable("radio_list_radios", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    radioListId: integer("radio_list_id").notNull().references(() => radioLists.id),
    radioId: text("radio_id").notNull().references(() => radios.id),
    createdAt: text("created_at").default(now()),
  });
  
  // FAVORITES (User's favorite radios)
  export const favorites = sqliteTable("favorites", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: text("user_id").notNull().references(() => users.id),
    radioId: text("radio_id").notNull().references(() => radios.id),
    createdAt: text("created_at").default(now()),
  });
  
  // RELATIONS
  export const usersRelations = relations(users, ({ many }) => ({
    radioLists: many(radioLists),
    favorites: many(favorites),
  }));
  
  export const countriesRelations = relations(countries, ({ many }) => ({
    radios: many(radios),
  }));
  
  export const genresRelations = relations(genres, ({ many }) => ({
    radioGenres: many(radioGenres),
  }));
  
  export const radiosRelations = relations(radios, ({ many, one }) => ({
    country: one(countries, {
      fields: [radios.countryId],
      references: [countries.id],
    }),
    radioGenres: many(radioGenres),
    radioListRadios: many(radioListRadios),
    favorites: many(favorites),
  }));
  
  export const radioGenresRelations = relations(radioGenres, ({ one }) => ({
    radio: one(radios, {
      fields: [radioGenres.radioId],
      references: [radios.id],
    }),
    genre: one(genres, {
      fields: [radioGenres.genreId],
      references: [genres.id],
    }),
  }));
  
  export const radioListsRelations = relations(radioLists, ({ one, many }) => ({
    user: one(users, {
      fields: [radioLists.userId],
      references: [users.id],
    }),
    radioListRadios: many(radioListRadios),
  }));
  
  export const radioListRadiosRelations = relations(radioListRadios, ({ one }) => ({
    radioList: one(radioLists, {
      fields: [radioListRadios.radioListId],
      references: [radioLists.id],
    }),
    radio: one(radios, {
      fields: [radioListRadios.radioId],
      references: [radios.id],
    }),
  }));
  
  export const favoritesRelations = relations(favorites, ({ one }) => ({
    user: one(users, {
      fields: [favorites.userId],
      references: [users.id],
    }),
    radio: one(radios, {
      fields: [favorites.radioId],
      references: [radios.id],
    }),
  }));