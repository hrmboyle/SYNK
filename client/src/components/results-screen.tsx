import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, RefreshCw, Play } from "lucide-react";
import type { CompleteJourneyResponse } from "@/lib/api";

interface ResultsScreenProps {
  results: CompleteJourneyResponse;
  selectedAnswers: {
    riddle: string;
    sigil: string;
    weather: string;
  };
  onReset: () => void;
}

export function ResultsScreen({ results, selectedAnswers, onReset }: ResultsScreenProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Mystical Oracle Reading",
        text: results.mantra,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(
        `My Mystical Oracle Reading:\n\n"${results.mantra}"\n\nGenerated at ${window.location.href}`
      );
    }
  };

  const renderSelectedSigil = () => {
    // Render based on the sigil name - simplified version
    if (results.selectedSigil.toLowerCase().includes("triangle") || results.selectedSigil.toLowerCase().includes("ascension")) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-mystical-gold" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
        </div>
      );
    } else {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-5 border-2 border-mystical-gold rounded-full" style={{ transform: "rotate(45deg)" }}></div>
          <div className="w-10 h-5 border-2 border-mystical-gold rounded-full" style={{ transform: "rotate(-45deg)" }}></div>
        </div>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen py-12 px-6"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        


        {/* Selected Sigil Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="question-card p-8 mystical-glow text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <motion.div
                  className="sigil relative"
                  style={{ width: "120px", height: "120px" }}
                  animate={{ 
                    rotateZ: [0, 360],
                  }}
                  transition={{ 
                    rotateZ: { duration: 20, repeat: Infinity, ease: "linear" }
                  }}
                >
                  {renderSelectedSigil()}
                </motion.div>
              </div>
              <p className="text-cosmic-200">
                {results.selectedSigil} - Symbol of rising consciousness and spiritual evolution
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI-Generated Mantra */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="question-card p-8 mystical-glow">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg leading-relaxed text-cosmic-200 italic whitespace-pre-line">
                  {results.mantra}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Generated Poem */}
        {results.poem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="question-card p-8 mystical-glow">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-base leading-relaxed text-cosmic-200 whitespace-pre-line">
                    {results.poem}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Suno Song Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="question-card p-8 mystical-glow">
            <CardContent className="pt-6">
              <div className="bg-cosmic-800/50 p-6 rounded-xl border border-cosmic-600">
                {/* Simulated Audio Player */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cosmic-600 to-mystical-gold rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-mystical-pearl" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-mystical-pearl">Echoes of Your Journey</p>
                    <p className="text-sm text-cosmic-400">Generated from your cosmic answers</p>
                  </div>
                </div>
                
                {/* Simulated Progress Bar */}
                <div className="w-full bg-cosmic-700 rounded-full h-1 mb-6">
                  <motion.div 
                    className="bg-mystical-gold h-1 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "33%" }}
                    transition={{ duration: 2, delay: 1.2 }}
                  />
                </div>
                
                {/* Song Prompt Display */}
                <div className="p-4 bg-cosmic-900/50 rounded-lg">
                  <p className="text-sm text-cosmic-300 mb-2">Song Creation Prompt:</p>
                  <p className="text-sm text-cosmic-200">
                    {results.songPrompt}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Journey Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="question-card p-8 mystical-glow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-mystical-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-cosmic-900 font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-sm text-cosmic-300">The Riddle Response</p>
                    <p className="text-mystical-pearl">"{selectedAnswers.riddle}"</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-mystical-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-cosmic-900 font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-sm text-cosmic-300">Sacred Symbol</p>
                    <p className="text-mystical-pearl">{selectedAnswers.sigil}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-mystical-gold rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs text-cosmic-900 font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-sm text-cosmic-300">Atmospheric Essence</p>
                    <p className="text-mystical-pearl">"{selectedAnswers.weather}"</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Share and Reset Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={handleShare}
            className="answer-button px-8 py-3 rounded-xl font-medium text-mystical-gold hover:text-mystical-lightGold transition-all"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Your Reading
          </Button>
          <Button
            onClick={onReset}
            className="answer-button px-8 py-3 rounded-xl font-medium text-cosmic-300 hover:text-mystical-pearl transition-all"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Begin New Journey
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
