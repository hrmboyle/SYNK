import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { 
  generateRiddle, 
  generateSigils, 
  generateMantraAndPoem, 
  generateSongPrompt 
} from "./lib/openai";
import { insertOracleSessionSchema, updateOracleSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Start a new oracle session
  app.post("/api/oracle/start", async (req, res) => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Generate initial riddle
      const { riddle, answers } = await generateRiddle();
      
      const newSession = await storage.createOracleSession({
        sessionId,
        riddleText: riddle,
        riddleAnswers: answers,
        selectedRiddleAnswer: null,
        sigilChoices: null,
        selectedSigil: null,
        weatherInput: null,
        generatedMantra: null,
        generatedPoem: null,
        songPrompt: null,
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
        message: "Failed to start oracle session. Please check your OpenAI API configuration." 
      });
    }
  });

  // Submit riddle answer and get sigil options
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

      // Generate sigils based on the riddle answer
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

  // Submit sigil selection
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

  // Complete journey with weather input and generate final results
  app.post("/api/oracle/complete", async (req, res) => {
    try {
      const { sessionId, weatherInput } = z.object({
        sessionId: z.string(),
        weatherInput: z.string(),
      }).parse(req.body);

      const session = await storage.getOracleSession(sessionId);
      if (!session || !session.selectedRiddleAnswer || !session.selectedSigil) {
        return res.status(400).json({ 
          message: "Incomplete session. Please complete all previous steps." 
        });
      }

      // Generate mantra and poem based on all user inputs
      const { mantra, poem } = await generateMantraAndPoem(
        session.selectedRiddleAnswer,
        session.selectedSigil,
        weatherInput
      );

      // Generate song prompt for Suno
      const songPrompt = await generateSongPrompt(
        session.selectedRiddleAnswer,
        session.selectedSigil,
        weatherInput,
        mantra
      );

      const updated = await storage.updateOracleSession(sessionId, {
        weatherInput,
        generatedMantra: mantra,
        generatedPoem: poem,
        songPrompt,
        completed: true,
      });

      res.json({
        sessionId: updated?.sessionId,
        riddleAnswer: updated?.selectedRiddleAnswer,
        selectedSigil: updated?.selectedSigil,
        weatherInput: updated?.weatherInput,
        mantra: updated?.generatedMantra,
        poem: updated?.generatedPoem,
        songPrompt: updated?.songPrompt,
      });
    } catch (error) {
      console.error("Error completing oracle journey:", error);
      res.status(500).json({ 
        message: "Failed to complete your mystical journey. Please try again." 
      });
    }
  });

  // Get session details
  app.get("/api/oracle/session/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const session = await storage.getOracleSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      console.error("Error retrieving session:", error);
      res.status(500).json({ 
        message: "Failed to retrieve session details." 
      });
    }
  });

  // Get recent completed sessions (for sharing/browsing)
  app.get("/api/oracle/recent", async (req, res) => {
    try {
      const sessions = await storage.getRecentSessions(10);
      const completedSessions = sessions.filter(s => s.completed);
      
      res.json(completedSessions.map(session => ({
        sessionId: session.sessionId,
        mantra: session.generatedMantra,
        createdAt: session.createdAt,
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
