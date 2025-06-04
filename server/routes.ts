import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import {
  generateRiddle,
  generateSigils,
  generateMantra,
  generateTarotCardImage,
  generateAsciiArtForCard // Correctly imported
} from "./lib/openai";
import type { UpdateOracleSession } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {

  app.post("/api/oracle/start", async (req, res) => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const { riddle, answers } = await generateRiddle();

      const newSession = await storage.createOracleSession({
        sessionId,
        riddleText: riddle,
        riddleAnswers: answers,
        selectedRiddleAnswer: null,
        sigilChoices: null,
        selectedSigil: null,
        cardValue: null,
        mantra: null,
        poem: null,
        songPrompt: null,
        tarotCardSvgString: null,
        asciiArt: null, // Correctly initialized as asciiArt
        completed: false,
      });

      res.json({
        sessionId: newSession.sessionId,
        riddle: newSession.riddleText,
        answers: newSession.riddleAnswers,
      });
    } catch (error) {
      console.error("Error starting oracle session:", error);
      res.status(500).json({
        message: "Failed to start oracle session. Please check your AI API configuration."
      });
    }
  });

  app.post("/api/oracle/riddle-answer", async (req, res) => {
    try {
      const { sessionId, answer } = z.object({
        sessionId: z.string(),
        answer: z.string(),
      }).parse(req.body);

      const session = await storage.getOracleSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      const sigils = await generateSigils(answer);
      const updated = await storage.updateOracleSession(sessionId, {
        selectedRiddleAnswer: answer,
        sigilChoices: sigils,
      });

      res.json({
        sigils: updated?.sigilChoices,
      });
    } catch (error) {
      console.error("Error processing riddle answer:", error);
      res.status(500).json({
        message: "Failed to process riddle answer. Please try again."
      });
    }
  });

  app.post("/api/oracle/sigil-selection", async (req, res) => {
    try {
      const { sessionId, sigil } = z.object({
        sessionId: z.string(),
        sigil: z.string(),
      }).parse(req.body);

      const session = await storage.getOracleSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      await storage.updateOracleSession(sessionId, {
        selectedSigil: sigil,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error processing sigil selection:", error);
      res.status(500).json({
        message: "Failed to process sigil selection. Please try again."
      });
    }
  });

  app.post("/api/oracle/complete", async (req, res) => {
    try {
      const { sessionId, cardValue } = z.object({
        sessionId: z.string(),
        cardValue: z.string(),
      }).parse(req.body);

      const session = await storage.getOracleSession(sessionId);
      if (!session || !session.selectedRiddleAnswer || !session.selectedSigil) {
        return res.status(400).json({
          message: "Incomplete session. Please complete all previous steps."
        });
      }

      const tarotCardSvgString = await generateTarotCardImage(cardValue);
      console.log("Generated Tarot Card SVG Data:", tarotCardSvgString ? tarotCardSvgString.substring(0, 100) + "..." : "null");

      const asciiArtContent = await generateAsciiArtForCard(cardValue); // Renamed variable for clarity
      console.log("Generated ASCII Art Content:", asciiArtContent ? asciiArtContent.substring(0, 100) + "..." : "null");


      const aiGeneratedContent = await generateMantra(
        session.selectedRiddleAnswer,
        session.selectedSigil,
        cardValue
      );

      const updateData: Partial<UpdateOracleSession> = {
        cardValue: cardValue,
        mantra: aiGeneratedContent.mantra,
        tarotCardSvgString: tarotCardSvgString,
        asciiArt: asciiArtContent, // <-- USE asciiArt field name
        completed: true,
        poem: null, 
      };
      
      // This if-block for poem is fine, ensures it's explicitly null if present.
      if ('poem' in updateData) {
          (updateData as any).poem = null;
      }

      const updated = await storage.updateOracleSession(sessionId, updateData);

      res.json({
        sessionId: updated?.sessionId,
        riddleAnswer: updated?.selectedRiddleAnswer,
        selectedSigil: updated?.selectedSigil,
        cardValue: updated?.cardValue,
        mantra: updated?.mantra,
        poem: updated?.poem, 
        songPrompt: updated?.songPrompt,
        tarotCardSvgString: updated?.tarotCardSvgString,
        asciiArt: updated?.asciiArt, // <-- INCLUDE asciiArt IN RESPONSE
      });
    } catch (error) {
      console.error("Error completing oracle journey:", error);
      res.status(500).json({
        message: "Failed to complete your mystical journey. Please try again."
      });
    }
  });

  app.get("/api/oracle/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const sessionData = await storage.getOracleSession(sessionId);
      if (!sessionData) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json({
        ...sessionData,
        asciiArt: sessionData.asciiArt ?? null // <-- USE asciiArt
      });
    } catch (error) {
      console.error("Error retrieving session:", error);
      res.status(500).json({
        message: "Failed to retrieve session details."
      });
    }
  });

  app.get("/api/oracle/recent", async (req, res) => {
    try {
      const sessions = await storage.getRecentSessions(10);
      const completedSessions = sessions.filter(s => s.completed);

      res.json(completedSessions.map(s => ({
        sessionId: s.sessionId,
        mantra: s.mantra,
        createdAt: s.createdAt,
        tarotCardSvgString: s.tarotCardSvgString,
        selectedSigil: s.selectedSigil,
        asciiArt: s.asciiArt ?? null, // <-- INCLUDE asciiArt
      })));
    } catch (error) {
      console.error("Error retrieving recent sessions:", error);
      res.status(500).json({
        message: "Failed to retrieve recent oracle readings."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}