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
  sigilChoices: jsonb("sigil_choices").$type<string[]>(), // These are SVG strings
  selectedSigil: text("selected_sigil"), // This is an SVG string
  cardValue: text("card_value"), // This is the Tarot card name
  mantra: text("mantra"),
  poem: text("poem"),
  songPrompt: text("song_prompt"),
  tarotCardSvgString: text("tarot_card_svg_string"), // CHANGED from tarotCardImageUrl to store SVG string
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Ensure all fields are included or explicitly omitted as needed
export const insertOracleSessionSchema = createInsertSchema(oracleSessions, {
  // Override types for jsonb fields if necessary, though $type should handle it for selection
  riddleAnswers: z.array(z.string()).nullable(),
  sigilChoices: z.array(z.string()).nullable(),
  tarotCardSvgString: z.string().nullable(), // ADDED schema for the new/renamed field
}).omit({
  id: true,
  createdAt: true,
});

export const updateOracleSessionSchema = createInsertSchema(oracleSessions, {
  riddleAnswers: z.array(z.string()).nullable(),
  sigilChoices: z.array(z.string()).nullable(),
  tarotCardSvgString: z.string().nullable(), // ADDED schema for the new/renamed field
}).partial().required({
  sessionId: true,
});


export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type OracleSession = typeof oracleSessions.$inferSelect; // This will now include tarotCardSvgString
export type InsertOracleSession = z.infer<typeof insertOracleSessionSchema>; // This will now include tarotCardSvgString
export type UpdateOracleSession = z.infer<typeof updateOracleSessionSchema>; // This will now include tarotCardSvgString