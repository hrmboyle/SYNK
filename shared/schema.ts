import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const oracleSessions = pgTable("oracle_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  riddleText: text("riddle_text"),
  riddleAnswers: jsonb("riddle_answers").$type<string[]>(),
  selectedRiddleAnswer: text("selected_riddle_answer"),
  sigilChoices: jsonb("sigil_choices").$type<string[]>(),
  selectedSigil: text("selected_sigil"),
  weatherInput: text("weather_input"),
  generatedMantra: text("generated_mantra"),
  generatedPoem: text("generated_poem"),
  songPrompt: text("song_prompt"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertOracleSessionSchema = createInsertSchema(oracleSessions).omit({
  id: true,
  createdAt: true,
});

export const updateOracleSessionSchema = insertOracleSessionSchema.partial().required({
  sessionId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type OracleSession = typeof oracleSessions.$inferSelect;
export type InsertOracleSession = z.infer<typeof insertOracleSessionSchema>;
export type UpdateOracleSession = z.infer<typeof updateOracleSessionSchema>;
