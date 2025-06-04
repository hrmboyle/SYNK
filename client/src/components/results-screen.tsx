import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CompleteJourneyResponse } from '@/lib/api';

interface ResultsScreenProps {
  results: CompleteJourneyResponse;
  selectedAnswers: {
    riddle: string;
    sigil: string; // This is an SVG string
    card: string; // This is the Tarot card name
  };
  onReset: () => void;
}

export function ResultsScreen({
  results,
  selectedAnswers,
  onReset,
}: ResultsScreenProps) {
  console.log(
    'Tarot Card SVG String received in ResultsScreen:',
    results.tarotCardSvgString
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className='min-h-screen py-12 px-4 sm:px-6 flex flex-col items-center justify-center'
    >
      <div className='max-w-3xl w-full mx-auto space-y-8 md:space-y-12'>
        {/* Grid for Tarot Card */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start'>
          {/* Drawn Tarot Card SVG Display */}
          {results.tarotCardSvgString && (
            <motion.div
              className='md:col-span-2 flex justify-center' // Center the card
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className='question-card p-4 sm:p-6 mystical-glow text-center h-full flex flex-col max-w-md'>
                <CardHeader className='pb-2 sm:pb-3'>
                  <CardTitle className='text-xl sm:text-2xl font-semibold text-mystical-gold'>
                    {/* The Drawn Card - REMOVED */}
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-2 sm:pt-4 flex-grow flex flex-col items-center justify-center'>
                  <div className='w-48 h-72 sm:w-56 sm:h-[336px] md:w-64 md:h-[384px] bg-transparent rounded-lg shadow-xl border-2 border-mystical-gold flex items-center justify-center overflow-hidden p-1 mx-auto'>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: results.tarotCardSvgString,
                      }}
                      className='w-full h-full flex items-center justify-center'
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Selected Sigil Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: results.tarotCardSvgString ? 0.4 : 0.2,
            duration: 0.5, // This is for the card fade-in, not the sigil rotation
          }}
        >
          <Card className='question-card p-6 sm:p-8 mystical-glow text-center'>
            <CardContent className='pt-4'>
              <div className='flex justify-center'>
                <motion.div
                  className='w-28 h-28 sm:w-32 sm:h-32 p-2 bg-white rounded-xl shadow-lg border-2 border-mystical-gold flex items-center justify-center overflow-hidden'
                  animate={{
                    rotateZ: [0, 360], // Animate rotateZ from 0 to 360 degrees
                  }}
                  transition={{
                    // Transition specific to rotateZ property
                    rotateZ: {
                      duration: 20, // Slow rotation (10 seconds per full cycle)
                      repeat: Infinity, // Repeat the animation indefinitely
                      ease: 'linear', // Constant speed
                    },
                  }}
                >
                  {selectedAnswers.sigil && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: selectedAnswers.sigil,
                      }}
                      className='w-full h-full flex items-center justify-center'
                    />
                  )}
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI-Generated Mantra */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: results.tarotCardSvgString ? 0.5 : 0.3,
            duration: 0.5,
          }}
        >
          <Card className='question-card p-6 sm:p-8 mystical-glow'>
            <CardContent className='pt-4'>
              <div className='text-center'>
                <p className='text-md sm:text-lg leading-relaxed text-cosmic-200 italic whitespace-pre-line'>
                  {results.mantra}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reset Button */}
        <motion.div
          className='text-center mt-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: results.tarotCardSvgString ? 0.6 : 0.4,
            duration: 0.5,
          }}
        >
          <button
            onClick={onReset}
            className='px-8 py-3 bg-mystical-gold text-cosmic-900 font-semibold rounded-lg shadow-md hover:bg-mystical-lightGold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-mystical-pearl focus:ring-offset-2 focus:ring-offset-cosmic-800 text-2xl' // <--- ADDED text-2xl HERE
          >
            🔄
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
