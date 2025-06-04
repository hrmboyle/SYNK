import { apiRequest } from "./queryClient";

// This interface is likely for the GET /api/oracle/session/:sessionId endpoint
// and other places where the full session state is handled on the client.
export interface OracleSession {
  sessionId: string;
  riddleText?: string; // Matches backend field 'riddleText'
  riddleAnswers?: string[]; // Matches backend field 'riddleAnswers'
  selectedRiddleAnswer?: string | null;
  sigilChoices?: string[] | null;
  selectedSigil?: string | null;
  cardValue?: string | null;
  mantra?: string | null;
  poem?: string | null;
  songPrompt?: string | null;
  tarotCardSvgString?: string | null;
  asciiArt?: string | null;
  soundCode?: string | null; // <-- ADDED to match backend
  completed?: boolean;
  createdAt?: string;
}

export interface StartOracleSessionResponse {
  sessionId: string;
  riddle: string;
  answers: string[];
}


export interface RiddleAnswerResponse {
  sigils: string[];
}

export interface CompleteJourneyResponse {
  sessionId: string;
  riddleAnswer: string | null;
  selectedSigil: string | null;
  cardValue: string | null;
  mantra: string | null;
  poem: string | null;
  songPrompt: string | null;
  tarotCardSvgString?: string | null;
  asciiArt?: string | null;
  soundCode?: string | null; // <-- ADDED to match backend
}

export async function startOracleSession(): Promise<StartOracleSessionResponse> {
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

export async function getSession(sessionId: string): Promise<OracleSession> {
  const response = await apiRequest("GET", `/api/oracle/session/${sessionId}`);
  return await response.json();
}