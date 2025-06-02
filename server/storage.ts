import {
  users,
  oracleSessions,
  type User,
  type InsertUser,
  type OracleSession,
  type InsertOracleSession,
  type UpdateOracleSession
} from "@shared/schema"; // Assuming schema.ts is correctly updated to include tarotCardSvgString

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
  private oracleSessions: Map<string, OracleSession>;
  private currentUserId: number;
  private currentSessionId: number; // For internal ID, not the sessionId string

  constructor() {
    this.users = new Map();
    this.oracleSessions = new Map();
    this.currentUserId = 1;
    this.currentSessionId = 1; // Drizzle handles serial 'id' if using a real DB
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
    const internalId = this.currentSessionId++; // For the map's internal ID if needed, or Drizzle's serial

    // Ensure all fields from OracleSession type are present, defaulting nullables
    const fullSessionData: OracleSession = {
      id: internalId, // Drizzle handles this in a real DB
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
      tarotCardSvgString: insertSession.tarotCardSvgString ?? null, // CHANGED: Initialize tarotCardSvgString
      // tarotCardImageUrl: insertSession.tarotCardImageUrl ?? null, // REMOVED or REPURPOSED: Original line for tarotCardImageUrl
      completed: insertSession.completed ?? false,
      createdAt: new Date(), // Drizzle handles defaultNow in a real DB
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

    // Create a new object for the updated session to ensure type compatibility
    // and to handle partial updates correctly.
    // This will work for tarotCardSvgString if UpdateOracleSession type is correct.
    const updatedSession: OracleSession = {
      ...existing,
      ...updates,
      // Ensure fields not in Partial<UpdateOracleSession> but in OracleSession retain their values
      // or are handled if they can be derived/changed during an update.
      // For example, if `id` or `createdAt` should not change on update:
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