import { apiRequest } from "./queryClient";




export interface OracleSession { // This type might be for the GET /api/oracle/session/:sessionId endpoint
  sessionId: string;
  riddle: string; // This should be riddleText from the backend
  answers: string[]; // This should be riddleAnswers from the backend
  // Add other fields if this is meant to represent the full session state from DB
  selectedRiddleAnswer?: string | null;
  sigilChoices?: string[] | null;
  selectedSigil?: string | null;
  cardValue?: string | null;
  mantra?: string | null;
  poem?: string | null;
  songPrompt?: string | null;
  tarotCardImageUrl?: string | null;
  completed?: boolean;
}

export interface StartOracleSessionResponse { // Renamed from OracleSession to be specific
  sessionId: string;
  riddle: string;
  answers: string[];
}


export interface RiddleAnswerResponse {
  sigils: string[]; // These are SVG strings
}

export interface CompleteJourneyResponse {
  sessionId: string;
  riddleAnswer: string | null;
  selectedSigil: string | null;
  cardValue: string | null; // This is the Tarot card name
  mantra: string | null;
  poem: string | null;
  songPrompt: string | null;
  tarotCardImageUrl?: string | null;
  tarotCardSvgString?: string | null; // <--- Ensure this line is present and correct
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
    sigil, // This is the SVG string of the selected sigil
  });
  return await response.json();
}

// cardValue here is the Tarot card name
export async function completeJourney(sessionId: string, cardValue: string): Promise<CompleteJourneyResponse> {
  const response = await apiRequest("POST", "/api/oracle/complete", {
    sessionId,
    cardValue,
  });
  return await response.json();
}

export async function getSession(sessionId: string): Promise<OracleSession> { // Returns the full session
  const response = await apiRequest("GET", `/api/oracle/session/${sessionId}`);
  return await response.json();
}
