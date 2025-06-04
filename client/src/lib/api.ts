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
  tarotCardSvgString?: string | null; // tarotCardImageUrl was renamed to tarotCardSvgString
  asciiArt?: string | null; // <-- ADDED to match backend
  completed?: boolean;
  createdAt?: string; // Consider if you need this on the client and its type (string vs Date)
}

export interface StartOracleSessionResponse {
  sessionId: string;
  riddle: string; // This is 'riddleText' from the backend session
  answers: string[]; // This is 'riddleAnswers' from the backend session
}


export interface RiddleAnswerResponse {
  sigils: string[]; // These are SVG strings
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
  asciiArt?: string | null; // <-- Correctly added
}

export async function startOracleSession(): Promise<StartOracleSessionResponse> {
  const response = await apiRequest("POST", "/api/oracle/start");
  // The backend for /api/oracle/start returns { sessionId, riddle, answers }
  // where 'riddle' is session.riddleText and 'answers' is session.riddleAnswers.
  // This matches StartOracleSessionResponse.
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

// This function expects the full OracleSession object from the backend
export async function getSession(sessionId: string): Promise<OracleSession> {
  const response = await apiRequest("GET", `/api/oracle/session/${sessionId}`);
  return await response.json();
}