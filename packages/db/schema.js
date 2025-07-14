// apps/web/db/schema.js
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Helper for timestamps
const now = () => sql`CURRENT_TIMESTAMP`;

// USERS
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  userName: text("user_name"),
  isDeleted: integer("is_deleted").notNull().default(0),
  createdAt: text("created_at").default(now()),
});

// COUNTRIES
export const countries = sqliteTable("countries", {
  id: text("id").primaryKey().unique(),
  countryName: text("country_name").notNull(),
  iso: text("iso_3166_1").notNull().unique(),
  isDeleted: integer("is_deleted").notNull().default(0),
  createdAt: text("created_at").default(now()),
});

// RADIOS
export const radios = sqliteTable("radios", {
  id: text("id").primaryKey(),
  radioName: text("radio_name").notNull(),
  url: text("url").notNull(),
  favicon: text("favicon"),
  countryId: text("country_id").references(() => countries.id),
  radioTags: text("radio_tags").default("[]"),
  radioLanguage: text("radio_language").default("[]"),
  isDeleted: integer("is_deleted").notNull().default(0),
  createdAt: text("created_at").default(now()),
});

// RADIO-LISTS (User-created lists)
export const usersLists = sqliteTable("users_lists", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  userListName: text("user_list_name").notNull(),
  isDeleted: integer("is_deleted").notNull().default(0),
  createdAt: text("created_at").default(now()),
});

// RADIO-LIST-RADIOS (Many-to-many: radios in lists)
export const usersListsRadios = sqliteTable("users_lists_radios", {
  id: text("id").primaryKey(),
  usersListId: text("user_list_id")
    .notNull()
    .references(() => usersLists.id),
  radioId: text("radio_id")
    .notNull()
    .references(() => radios.id),
  createdAt: text("created_at").default(now()),
});

// FAVORITES (User's favorite radios)
export const favorites = sqliteTable("favorites", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  createdAt: text("created_at").default(now()),
});

// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  usersLists: many(usersLists),
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
  usersListsRadios: many(usersListsRadios),
  favorites: many(favorites),
}));

export const usersListsRelations = relations(usersLists, ({ one, many }) => ({
  user: one(users, {
    fields: [usersLists.userId],
    references: [users.id],
  }),
  usersListsRadios: many(usersListsRadios),
}));

export const usersListsRadiosRelations = relations(
  usersListsRadios,
  ({ one }) => ({
    usersList: one(usersLists, {
      fields: [usersListsRadios.usersListId],
      references: [usersLists.id],
    }),
    radio: one(radios, {
      fields: [usersListsRadios.radioId],
      references: [radios.id],
    }),
  }),
);

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
}));
