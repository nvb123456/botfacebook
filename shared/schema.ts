import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const botUsers = pgTable("bot_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  facebookId: text("facebook_id").notNull().unique(),
  name: text("name").notNull(),
  usedCode: text("used_code"),
  receivedAt: timestamp("received_at").defaultNow(),
});

export const giftCodes = pgTable("gift_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  isUsed: boolean("is_used").default(false),
  usedBy: text("used_by"),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const botSettings = pgTable("bot_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandName: text("brand_name").notNull().default("GameShop"),
  appUrl: text("app_url").notNull().default("https://test.com"),
  welcomeMessage: text("welcome_message").notNull(),
  autoReply: boolean("auto_reply").default(true),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBotUserSchema = createInsertSchema(botUsers).omit({
  id: true,
  receivedAt: true,
});

export const insertGiftCodeSchema = createInsertSchema(giftCodes).omit({
  id: true,
  isUsed: true,
  usedBy: true,
  usedAt: true,
  createdAt: true,
});

export const insertBotSettingsSchema = createInsertSchema(botSettings).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type BotUser = typeof botUsers.$inferSelect;
export type InsertBotUser = z.infer<typeof insertBotUserSchema>;
export type GiftCode = typeof giftCodes.$inferSelect;
export type InsertGiftCode = z.infer<typeof insertGiftCodeSchema>;
export type BotSettings = typeof botSettings.$inferSelect;
export type InsertBotSettings = z.infer<typeof insertBotSettingsSchema>;
