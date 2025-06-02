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

export type SessionStep = "welcome" | "loading" | "riddle" | "sigil" | "weather" | "results";

export function useOracleSession() {
  const [currentStep, setCurrentStep] = useState<SessionStep>("welcome");
  const [sessionData, setSessionData] = useState<OracleSession | null>(null);
  const [sigilOptions, setSigilOptions] = useState<string[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState({
    riddle: "",
    sigil: "",
    weather: "",
  });
  const [results, setResults] = useState<CompleteJourneyResponse | null>(null);

  const startSessionMutation = useMutation({
    mutationFn: startOracleSession,
    onSuccess: (data) => {
      setSessionData(data);
      setCurrentStep("riddle");
    },
    onError: (error) => {
      console.error("Failed to start oracle session:", error);
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
      setCurrentStep("weather");
    },
    onError: (error) => {
      console.error("Failed to submit sigil selection:", error);
    },
  });

  const completeJourneyMutation = useMutation({
    mutationFn: ({ sessionId, weatherInput }: { sessionId: string; weatherInput: string }) =>
      completeJourney(sessionId, weatherInput),
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

  const submitWeatherInput = useCallback((weatherInput: string) => {
    if (!sessionData) return;
    
    setSelectedAnswers(prev => ({ ...prev, weather: weatherInput }));
    setCurrentStep("loading");
    completeJourneyMutation.mutate({ sessionId: sessionData.sessionId, weatherInput });
  }, [sessionData, completeJourneyMutation]);

  const resetJourney = useCallback(() => {
    setCurrentStep("welcome");
    setSessionData(null);
    setSigilOptions([]);
    setSelectedAnswers({ riddle: "", sigil: "", weather: "" });
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
    submitWeatherInput,
    resetJourney,
  };
}
