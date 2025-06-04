// apps/web/db/schema.js
import {
    sqliteTable,
    text,
    integer,
  } from "drizzle-orm/sqlite-core";
  import { relations } from "drizzle-orm";
  import { sql } from "drizzle-orm";
  
  // Helper for timestamps
  const now = () => sql`CURRENT_TIMESTAMP`;
  
  // USERS
  export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    user_name: text("user_name"),
    avatar: text("avatar"),
    isDeleted: integer("is_deleted").notNull().default(0),
    createdAt: text("created_at").default(now()),
  });
  
  // COUNTRIES
  export const countries = sqliteTable("countries", {
    id: text("id").primaryKey(),
    country_name: text("country_name").notNull(),
    iso_3166_1: text("iso_3166_1").notNull().unique(),
    isDeleted: integer("is_deleted").notNull().default(0),
    createdAt: text("created_at").default(now()),
  });
  
  
  // RADIOS
  export const radios = sqliteTable("radios", {
    id: text("id").primaryKey(),
    radio_name: text("radio_name").notNull(),
    url: text("url").notNull(),
    favicon: text("favicon"),
    countryId: text("country_id").references(() => countries.id),
    radio_tags: text("radio_tags").default("[]"),
    radio_language: text("radio_language").default("[]"),
    isDeleted: integer("is_deleted").notNull().default(0),
    createdAt: text("created_at").default(now()),
  });
  
  // RADIO-LISTS (User-created lists)
  export const usersLists = sqliteTable("users_lists", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    user_list_name: text("user_list_name").notNull(),
    isDeleted: integer("is_deleted").notNull().default(0),
    createdAt: text("created_at").default(now()),
  });
  
  // RADIO-LIST-RADIOS (Many-to-many: radios in lists)
  export const usersListRadios = sqliteTable("users_list_radios", {
    id: text("id").primaryKey(),
    userListId: text("user_list_id").notNull().references(() => userLists.id),
    radioId: text("radio_id").notNull().references(() => radios.id),
    createdAt: text("created_at").default(now()),
  });
  
  // FAVORITES (User's favorite radios)
  export const favorites = sqliteTable("favorites", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id),
    radioId: text("radio_id").notNull().references(() => radios.id),
    createdAt: text("created_at").default(now()),
  });
  
  // RELATIONS
  export const usersRelations = relations(users, ({ many }) => ({
    userLists: many(userLists),
    favorites: many(favorites),
  }));
  
  export const countriesRelations = relations(countries, ({ many }) => ({
    radios: many(radios),
  }));
  
  export const radiosRelations = relations(radios, ({ many, one }) => ({
    country: one(countries, {
      fields: [radios.countryId],
      references: [countries.id], 
    }),
    userListRadios: many(userListRadios),
    favorites: many(favorites),
  }));
  
  export const userListsRelations = relations(userLists, ({ one, many }) => ({
    user: one(users, {
      fields: [userLists.userId],
      references: [users.id],
    }),
    userListRadios: many(userListRadios),
  }));
  
  export const userListRadiosRelations = relations(userListRadios, ({ one }) => ({
    userList: one(userLists, {
      fields: [userListRadios.userListId],
      references: [userLists.id],
    }),
    radio: one(radios, {
      fields: [userListRadios.radioId],
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