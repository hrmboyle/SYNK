import {
  users,
  oracleSessions,
  type User,
  type InsertUser,
  type OracleSession,
  type InsertOracleSession,
  type UpdateOracleSession
} from "@shared/schema"; // This correctly imports the updated types

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Oracle session methods
  createOracleSession(session: InsertOracleSession): Promise<OracleSession>;
  getOracleSession(sessionId: string): Promise<OracleSession | undefined>;
  updateOracleSession(sessionId: string, updates: Partial<UpdateOracleSession>): Promise<OracleSession | undefined>;
  getRecentSessions(limit?: number): Promise<OracleSession[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private oracleSessions: Map<string, OracleSession>; // This will use the updated OracleSession type
  private currentUserId: number;
  private currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.oracleSessions = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createOracleSession(insertSession: InsertOracleSession): Promise<OracleSession> {
    const internalId = this.currentSessionId++;

    const fullSessionData: OracleSession = {
      id: internalId,
      sessionId: insertSession.sessionId,
      riddleText: insertSession.riddleText ?? null,
      riddleAnswers: insertSession.riddleAnswers ?? null,
      selectedRiddleAnswer: insertSession.selectedRiddleAnswer ?? null,
      sigilChoices: insertSession.sigilChoices ?? null,
      selectedSigil: insertSession.selectedSigil ?? null,
      cardValue: insertSession.cardValue ?? null,
      mantra: insertSession.mantra ?? null,
      poem: insertSession.poem ?? null,
      songPrompt: insertSession.songPrompt ?? null,
      tarotCardSvgString: insertSession.tarotCardSvgString ?? null,
      asciiArt: insertSession.asciiArt ?? null,
      soundCode: insertSession.soundCode ?? null, // <-- ADDED: Initialize soundCode
      completed: insertSession.completed ?? false,
      createdAt: new Date(),
    };

    this.oracleSessions.set(insertSession.sessionId, fullSessionData);
    return fullSessionData;
  }

  async getOracleSession(sessionId: string): Promise<OracleSession | undefined> {
    return this.oracleSessions.get(sessionId);
  }

  async updateOracleSession(sessionId: string, updates: Partial<UpdateOracleSession>): Promise<OracleSession | undefined> {
    const existing = this.oracleSessions.get(sessionId);
    if (!existing) return undefined;

    // The spread operator will correctly handle the new 'soundCode' field if it's in 'updates'
    const updatedSession: OracleSession = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
    };

    this.oracleSessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async getRecentSessions(limit: number = 10): Promise<OracleSession[]> {
    return Array.from(this.oracleSessions.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();