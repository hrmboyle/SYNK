import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  startOracleSession,
  submitRiddleAnswer,
  submitSigilSelection,
  completeJourney,
  type OracleSession,
  type CompleteJourneyResponse,
} from "@/lib/api";

export type SessionStep = "welcome" | "loading" | "riddle" | "sigil" | "card" | "results";

export function useOracleSession() {
  const [currentStep, setCurrentStep] = useState<SessionStep>("welcome");
  const [sessionData, setSessionData] = useState<OracleSession | null>(null);
  const [sigilOptions, setSigilOptions] = useState<string[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState({
    riddle: "",
    sigil: "",
    card: "",
  });
  const [results, setResults] = useState<CompleteJourneyResponse | null>(null);

  const startSessionMutation = useMutation({
    mutationFn: startOracleSession,
    onSuccess: (data) => {
      console.log("Session started successfully:", data);
      console.log("Setting session data and transitioning to riddle");
      setSessionData(data);
      setCurrentStep("riddle");
      console.log("Current step should now be riddle");
    },
    onError: (error) => {
      console.error("Failed to start oracle session:", error);
      setCurrentStep("welcome"); // Reset to welcome on error
    },
  });

  const riddleAnswerMutation = useMutation({
    mutationFn: ({ sessionId, answer }: { sessionId: string; answer: string }) =>
      submitRiddleAnswer(sessionId, answer),
    onSuccess: (data) => {
      setSigilOptions(data.sigils);
      setCurrentStep("sigil");
    },
    onError: (error) => {
      console.error("Failed to submit riddle answer:", error);
    },
  });

  const sigilSelectionMutation = useMutation({
    mutationFn: ({ sessionId, sigil }: { sessionId: string; sigil: string }) =>
      submitSigilSelection(sessionId, sigil),
    onSuccess: () => {
      setCurrentStep("card");
    },
    onError: (error) => {
      console.error("Failed to submit sigil selection:", error);
    },
  });

  const completeJourneyMutation = useMutation({
    mutationFn: ({ sessionId, cardValue }: { sessionId: string; cardValue: string }) =>
      completeJourney(sessionId, cardValue),
    onSuccess: (data) => {
      setResults(data);
      setCurrentStep("results");
    },
    onError: (error) => {
      console.error("Failed to complete journey:", error);
    },
  });

  const showLoading = useCallback((duration: number = 2000) => {
    setCurrentStep("loading");
    setTimeout(() => {
      // The next step will be set by the mutation success handlers
    }, duration);
  }, []);

  const startJourney = useCallback(() => {
    console.log("Starting journey, setting loading state");
    setCurrentStep("loading");
    startSessionMutation.mutate();
  }, [startSessionMutation]);

  const selectRiddleAnswer = useCallback((answer: string) => {
    if (!sessionData) return;
    
    setSelectedAnswers(prev => ({ ...prev, riddle: answer }));
    setCurrentStep("loading");
    riddleAnswerMutation.mutate({ sessionId: sessionData.sessionId, answer });
  }, [sessionData, riddleAnswerMutation]);

  const selectSigil = useCallback((sigil: string) => {
    if (!sessionData) return;
    
    setSelectedAnswers(prev => ({ ...prev, sigil }));
    setCurrentStep("loading");
    sigilSelectionMutation.mutate({ sessionId: sessionData.sessionId, sigil });
  }, [sessionData, sigilSelectionMutation]);

  const submitCardValue = useCallback((cardValue: string) => {
    if (!sessionData) return;
    
    setSelectedAnswers(prev => ({ ...prev, card: cardValue }));
    setCurrentStep("loading");
    completeJourneyMutation.mutate({ sessionId: sessionData.sessionId, cardValue });
  }, [sessionData, completeJourneyMutation]);

  const resetJourney = useCallback(() => {
    setCurrentStep("welcome");
    setSessionData(null);
    setSigilOptions([]);
    setSelectedAnswers({ riddle: "", sigil: "", card: "" });
    setResults(null);
  }, []);

  return {
    currentStep,
    sessionData,
    sigilOptions,
    selectedAnswers,
    results,
    isLoading: currentStep === "loading" || 
               startSessionMutation.isPending || 
               riddleAnswerMutation.isPending || 
               sigilSelectionMutation.isPending || 
               completeJourneyMutation.isPending,
    startJourney,
    selectRiddleAnswer,
    selectSigil,
    submitCardValue,
    resetJourney,
  };
}
