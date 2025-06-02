import { AnimatePresence } from "framer-motion";
import { useOracleSession } from "@/hooks/use-oracle-session";
import { WelcomeScreen } from "@/components/welcome-screen";
import { LoadingScreen } from "@/components/loading-screen";
import { RiddleScreen } from "@/components/riddle-screen";
import { SigilScreen } from "@/components/sigil-screen";
import { CardScreen } from "@/components/card-screen";
import { ResultsScreen } from "@/components/results-screen";

export default function Home() {
  const {
    currentStep,
    sessionData,
    sigilOptions,
    selectedAnswers,
    results,
    isLoading,
    startJourney,
    selectRiddleAnswer,
    selectSigil,
    submitCardValue,
    resetJourney,
  } = useOracleSession();

  console.log("Current step:", currentStep);
  console.log("Session data:", sessionData);

  return (
    <div className="min-h-screen cosmic-gradient relative overflow-hidden">
      {/* Cosmic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cosmic-600 rounded-full opacity-10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mystical-gold rounded-full opacity-5 blur-3xl animate-pulse-slow"></div>
      </div>

      {currentStep === "welcome" && (
        <WelcomeScreen onStart={startJourney} />
      )}
      
      {currentStep === "loading" && (
        <LoadingScreen />
      )}
      
      {currentStep === "riddle" && sessionData && (
        <RiddleScreen
          riddle={sessionData.riddle}
          answers={sessionData.answers}
          onSelectAnswer={selectRiddleAnswer}
        />
      )}
      
      {currentStep === "riddle" && !sessionData && (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-mystical-gold">Error: No session data available</p>
        </div>
      )}
      
      {currentStep === "sigil" && sigilOptions.length > 0 && (
        <SigilScreen
          sigils={sigilOptions}
          onSelectSigil={selectSigil}
        />
      )}
      
      {currentStep === "card" && (
        <CardScreen
          onSubmit={submitCardValue}
        />
      )}
      
      {currentStep === "results" && results && (
        <ResultsScreen
          results={results}
          selectedAnswers={selectedAnswers}
          onReset={resetJourney}
        />
      )}
    </div>
  );
}
