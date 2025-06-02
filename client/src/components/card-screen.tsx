import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CardScreenProps {
  onSubmit: (cardValue: string) => void;
}

const suits = ['H', 'D', 'C', 'S']; // Hearts, Diamonds, Clubs, Spades
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Generate all 52 cards
const generateCards = () => {
  const cards = [];
  for (const suit of suits) {
    for (const value of values) {
      cards.push(`${value}${suit}`);
    }
  }
  return cards;
};

export function CardScreen({ onSubmit }: CardScreenProps) {
  const [cards] = useState(generateCards());
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % cards.length);
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, cards.length]);

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleSubmit = () => {
    onSubmit(cards[currentCardIndex]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="question-card p-8 rounded-2xl mystical-glow">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Card Display */}
            <div className="flex justify-center">
              <motion.div
                className="w-32 h-48 bg-cosmic-800 border-2 border-mystical-gold rounded-xl flex items-center justify-center"
                animate={isRunning ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.1, repeat: isRunning ? Infinity : 0 }}
              >
                <span className="text-2xl font-bold text-mystical-pearl">
                  {cards[currentCardIndex]}
                </span>
              </motion.div>
            </div>
            
            {isRunning ? (
              <Button
                onClick={handleStop}
                className="w-full answer-button p-4 rounded-xl font-medium text-mystical-gold hover:text-mystical-lightGold transition-all"
              >
                Stop
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-cosmic-200">
                  Card selected: {cards[currentCardIndex]}
                </p>
                <Button
                  onClick={handleSubmit}
                  className="w-full answer-button p-4 rounded-xl font-medium text-mystical-gold hover:text-mystical-lightGold transition-all"
                >
                  Continue
                </Button>
              </div>
            )}
          </motion.div>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-cosmic-400">
          <div className="w-2 h-2 bg-cosmic-600 rounded-full"></div>
          <div className="w-2 h-2 bg-cosmic-600 rounded-full"></div>
          <div className="w-2 h-2 bg-mystical-gold rounded-full"></div>
        </div>
      </div>
    </motion.div>
  );
}