import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface CardScreenProps {
  onSubmit: (cardValue: string) => void;
}

// Tarot Deck Data
const majorArcana = [
  'The Fool',
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
];

const minorArcanaSuits = ['Wands', 'Cups', 'Swords', 'Pentacles'];
const minorArcanaRanks = [
  'Ace',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Page',
  'Knight',
  'Queen',
  'King',
];

// Unicode symbols for cycling animation (from loading-screen.tsx)
const cyclingSymbols = [
  '✧', // White Four Pointed Star
  '❖', // Black Diamond Minus White X
  '◈', // White Diamond Containing Black Small Diamond
  '△', // White Up-Pointing Triangle
  '◎', // Bullseye
  '🜁', // Alchemical Symbol for Air
  '⊕', // Circled Plus / Earth Symbol
];

const generateTarotDeck = () => {
  const deck = [...majorArcana];
  for (const suit of minorArcanaSuits) {
    for (const rank of minorArcanaRanks) {
      deck.push(`${rank} of ${suit}`);
    }
  }
  return deck;
};

export function CardScreen({ onSubmit }: CardScreenProps) {
  const [tarotDeck] = useState(generateTarotDeck());
  // Initialize currentCardName with a random card for the initial state before cycling starts or if cycling is very brief
  const [currentCardName, setCurrentCardName] = useState(() => {
    const initialRandomIndex = Math.floor(Math.random() * tarotDeck.length);
    return tarotDeck[initialRandomIndex];
  });
  // State for the symbol displayed during cycling
  const [displayedSymbol, setDisplayedSymbol] = useState(cyclingSymbols[0]);
  const [isRunning, setIsRunning] = useState(true);
  const [cardStopped, setCardStopped] = useState(false);

  // Effect for cycling cards and symbols
  useEffect(() => {
    if (!isRunning) return;

    let symbolIndex = 0;
    const interval = setInterval(() => {
      // Cycle through symbols for display
      setDisplayedSymbol(cyclingSymbols[symbolIndex % cyclingSymbols.length]);
      symbolIndex++;

      // Simultaneously, pick a random Tarot card name. This will be the card selected if the user stops the cycle.
      const randomTarotIndex = Math.floor(Math.random() * tarotDeck.length);
      setCurrentCardName(tarotDeck[randomTarotIndex]);
    }, 120); // Speed of cycling

    return () => clearInterval(interval);
  }, [isRunning, tarotDeck]);

  // Effect to handle auto-submission after card stops
  useEffect(() => {
    if (cardStopped) {
      const timer = setTimeout(() => {
        onSubmit(currentCardName); // Submit the name of the Tarot card that was current when stopped
      }, 1800); // 1.8-second delay to see the card before submitting

      return () => clearTimeout(timer);
    }
  }, [cardStopped, currentCardName, onSubmit]);

  const handleCardClick = () => {
    if (isRunning) {
      setIsRunning(false);
      setCardStopped(true);
      // currentCardName is already set to the "stopped" card by the cycling useEffect
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen flex flex-col items-center justify-center p-6'
    >
      <div className='max-w-2xl mx-auto text-center space-y-8'>
        <div className='question-card p-8 rounded-2xl mystical-glow'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='space-y-8'
          >
            {/* Instruction Text */}
            <motion.p
              className='text-lg text-cosmic-300 mb-4'
              initial={{ opacity: 0 }}
              animate={{ opacity: isRunning ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            ></motion.p>

            {/* Card Display */}
            <div className='flex justify-center'>
              <motion.div
                className={`w-40 h-64 bg-cosmic-800 border-2 border-mystical-gold rounded-xl flex flex-col items-center justify-center p-4 text-center ${
                  isRunning ? 'cursor-pointer' : 'cursor-default'
                }`}
                onClick={handleCardClick}
                animate={
                  isRunning
                    ? {
                        opacity: [0.7, 1, 0.7],
                        scale: [1, 1.03, 1],
                      }
                    : {
                        scale: 1.1,
                        boxShadow:
                          '0px 0px 15px 5px hsl(var(--mystical-gold) / 0.7)',
                      }
                }
                transition={
                  isRunning
                    ? {
                        opacity: { duration: 0.15, repeat: Infinity },
                        scale: { duration: 0.15, repeat: Infinity },
                      }
                    : {
                        duration: 0.3,
                        ease: 'easeOut',
                      }
                }
                whileHover={
                  isRunning
                    ? {
                        scale: 1.05,
                        boxShadow:
                          '0px 0px 20px 3px hsl(var(--mystical-gold) / 0.5)',
                      }
                    : {}
                }
              >
                {/* Display cycling symbol or the final card name */}
                <span
                  className={`text-2xl font-semibold text-mystical-pearl ${
                    // Increased text size for symbols
                    !isRunning ? 'tracking-wide text-xl' : 'text-4xl' // Different sizes for symbol vs card name
                  }`}
                >
                  {isRunning ? displayedSymbol : currentCardName}
                </span>
              </motion.div>
            </div>

            {!isRunning && cardStopped && (
              <motion.p
                className='text-cosmic-200 mt-4'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              ></motion.p>
            )}
          </motion.div>
        </div>

        <div className='flex items-center justify-center space-x-2 text-cosmic-400'>
          <div className='w-2 h-2 bg-cosmic-600 rounded-full'></div>
          <div className='w-2 h-2 bg-cosmic-600 rounded-full'></div>
          <div className='w-2 h-2 bg-mystical-gold rounded-full'></div>
        </div>
      </div>
    </motion.div>
  );
}
