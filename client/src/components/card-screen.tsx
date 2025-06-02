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
  const [currentCardName, setCurrentCardName] = useState(tarotDeck[0]);
  const [isRunning, setIsRunning] = useState(true);
  const [cardStopped, setCardStopped] = useState(false);

  // Effect for cycling cards
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * tarotDeck.length);
      setCurrentCardName(tarotDeck[randomIndex]);
    }, 120); // Speed of card name cycling, slightly slower for readability

    return () => clearInterval(interval);
  }, [isRunning, tarotDeck]);

  // Effect to handle auto-submission after card stops
  useEffect(() => {
    if (cardStopped) {
      const timer = setTimeout(() => {
        onSubmit(currentCardName); // Submit the name of the Tarot card
      }, 1800); // 1.8-second delay to see the card before submitting

      return () => clearTimeout(timer);
    }
  }, [cardStopped, currentCardName, onSubmit]);

  const handleCardClick = () => {
    if (isRunning) {
      setIsRunning(false);
      setCardStopped(true);
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
                        // Simple visual effect for "shuffling" names
                        opacity: [0.7, 1, 0.7],
                        scale: [1, 1.03, 1],
                      }
                    : {
                        scale: 1.1, // Slightly larger when stopped
                        boxShadow:
                          '0px 0px 15px 5px hsl(var(--mystical-gold) / 0.7)', // Add a stronger glow when stopped
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
                {/* Display Tarot card name */}
                <span
                  className={`text-xl font-semibold text-mystical-pearl ${
                    !isRunning ? 'tracking-wide' : ''
                  }`}
                >
                  {currentCardName}
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
