import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
// import { Play } from 'lucide-react'; // Play icon might be re-added if Suno section is uncommented
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
  ); // <--- ADD THIS

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className='min-h-screen py-12 px-6 flex flex-col items-center justify-center'
    >
      <div className='max-w-2xl w-full mx-auto space-y-8 md:space-y-12'>
        {/* Drawn Tarot Card SVG Display */}
        {results.tarotCardSvgString && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className='question-card p-4 sm:p-6 mystical-glow text-center'>
              <CardContent className='pt-4 sm:pt-6'>
                <h3 className='text-xl sm:text-2xl font-semibold text-mystical-gold mb-3 sm:mb-4'></h3>
                <div className='flex justify-center mb-2'>
                  {/* Container for the SVG Tarot Card */}
                  {/* The SVG is expected to have its own white background as per the prompt in openai.ts */}
                  <div className='w-48 h-72 sm:w-56 sm:h-[336px] md:w-64 md:h-[384px] bg-transparent rounded-lg shadow-xl border-2 border-mystical-gold flex items-center justify-center overflow-hidden p-1'>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: results.tarotCardSvgString,
                      }}
                      // The SVG's viewBox should handle its internal scaling.
                      // These classes ensure the div itself takes up space and centers the SVG if it's smaller.
                      className='w-full h-full flex items-center justify-center'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Selected Sigil Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          // Adjust delay based on whether the Tarot card image is present
          transition={{ delay: results.tarotCardSvgString ? 0.4 : 0.2 }}
        >
          <Card className='question-card p-6 sm:p-8 mystical-glow text-center'>
            <CardContent className='pt-6'>
              <h3 className='text-lg sm:text-xl font-medium text-cosmic-300 mb-3 sm:mb-4'></h3>
              <div className='flex justify-center'>
                <motion.div
                  className='w-28 h-28 sm:w-32 sm:h-32 p-2 bg-white rounded-xl shadow-lg border-2 border-mystical-gold flex items-center justify-center overflow-hidden'
                  animate={{
                    rotateZ: [0, 360],
                  }}
                  transition={{
                    rotateZ: { duration: 40, repeat: Infinity, ease: 'linear' },
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
          transition={{ delay: results.tarotCardSvgString ? 0.6 : 0.4 }}
        >
          <Card className='question-card p-8 mystical-glow'>
            <CardContent className='pt-6'>
              <div className='text-center'>
                <h3 className='text-lg sm:text-xl font-medium text-mystical-gold mb-3 sm:mb-4'></h3>
                <p className='text-md sm:text-lg leading-relaxed text-cosmic-200 italic whitespace-pre-line'>
                  {results.mantra}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Suno Song Integration - REMAINS COMMENTED OUT */}
        {/* ... */}
      </div>
    </motion.div>
  );
}
