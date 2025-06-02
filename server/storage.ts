import { 
  users, 
  oracleSessions,
  type User, 
  type InsertUser,
  type OracleSession,
  type InsertOracleSession,
  type UpdateOracleSession
} from "@shared/schema";

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
    const id = this.currentSessionId++;
    const session: OracleSession = {
      ...insertSession,
      id,
      completed: false,
      createdAt: new Date(),
    };
    this.oracleSessions.set(insertSession.sessionId, session);
    return session;
  }

  async getOracleSession(sessionId: string): Promise<OracleSession | undefined> {
    return this.oracleSessions.get(sessionId);
  }

  async updateOracleSession(sessionId: string, updates: Partial<UpdateOracleSession>): Promise<OracleSession | undefined> {
    const existing = this.oracleSessions.get(sessionId);
    if (!existing) return undefined;

    const updated: OracleSession = {
      ...existing,
      ...updates,
    };
    this.oracleSessions.set(sessionId, updated);
    return updated;
  }

  async getRecentSessions(limit: number = 10): Promise<OracleSession[]> {
    return Array.from(this.oracleSessions.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
