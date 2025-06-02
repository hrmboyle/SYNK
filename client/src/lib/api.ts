import { apiRequest } from "./queryClient";

export interface OracleSession {
  sessionId: string;
  riddle: string;
  answers: string[];
}

export interface RiddleAnswerResponse {
  sigils: string[];
}

export interface CompleteJourneyResponse {
  sessionId: string;
  riddleAnswer: string;
  selectedSigil: string;
  cardValue: string;
  mantra: string;
  poem: string;
  songPrompt: string;
}

export async function startOracleSession(): Promise<OracleSession> {
  const response = await apiRequest("POST", "/api/oracle/start");
  return await response.json();
}

export async function submitRiddleAnswer(sessionId: string, answer: string): Promise<RiddleAnswerResponse> {
  const response = await apiRequest("POST", "/api/oracle/riddle-answer", {
    sessionId,
    answer,
  });
  return await response.json();
}

export async function submitSigilSelection(sessionId: string, sigil: string): Promise<{ success: boolean }> {
  const response = await apiRequest("POST", "/api/oracle/sigil-selection", {
    sessionId,
    sigil,
  });
  return await response.json();
}

export async function completeJourney(sessionId: string, cardValue: string): Promise<CompleteJourneyResponse> {
  const response = await apiRequest("POST", "/api/oracle/complete", {
    sessionId,
    cardValue,
  });
  return await response.json();
}

export async function getSession(sessionId: string) {
  const response = await apiRequest("GET", `/api/oracle/session/${sessionId}`);
  return await response.json();
}
