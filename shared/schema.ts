// In shared/schema.ts

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
  cardValue: text("card_value"),
  mantra: text("mantra"),
  poem: text("poem"),
  songPrompt: text("song_prompt"),
  tarotCardSvgString: text("tarot_card_svg_string"),
  asciiArt: text("ascii_art"),
  soundCode: text("sound_code"), // <-- ADDED FIELD for Tone.js code
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertOracleSessionSchema = createInsertSchema(oracleSessions, {
  riddleAnswers: z.array(z.string()).nullable(),
  sigilChoices: z.array(z.string()).nullable(),
  tarotCardSvgString: z.string().nullable(),
  asciiArt: z.string().nullable(),
  soundCode: z.string().nullable(), // <-- ADDED to Zod schema
}).omit({
  id: true,
  createdAt: true,
});

export const updateOracleSessionSchema = createInsertSchema(oracleSessions, {
  riddleAnswers: z.array(z.string()).nullable(),
  sigilChoices: z.array(z.string()).nullable(),
  tarotCardSvgString: z.string().nullable(),
  asciiArt: z.string().nullable(),
  soundCode: z.string().nullable(), // <-- ADDED to Zod schema
}).partial().required({
  sessionId: true,
});


export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type OracleSession = typeof oracleSessions.$inferSelect; // Will now include asciiArt and soundCode
export type InsertOracleSession = z.infer<typeof insertOracleSessionSchema>; // Will now include asciiArt and soundCode
export type UpdateOracleSession = z.infer<typeof updateOracleSessionSchema>; // Will now include asciiArt and soundCode