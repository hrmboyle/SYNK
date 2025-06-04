import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CompleteJourneyResponse } from '@/lib/api';
import * as Tone from 'tone'; // Import Tone.js
import { useEffect, useState, useCallback } from 'react'; // Import useEffect and useState

interface ResultsScreenProps {
  results: CompleteJourneyResponse;
  selectedAnswers: {
    riddle: string;
    sigil: string; // This is an SVG string
    card: string; // This is the Tarot card name
  };
  onReset: () => void;
}

// A simple way to try and clean up - AI would need to assign to these
declare global {
  interface Window {
    activeOracleSynth?: any;
    activeOracleLoop?: any;
    activeOracleEffect?: any; // Add more if AI uses other common types
  }
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
  console.log('Sound Code received in ResultsScreen:', results.soundCode);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasToneStarted, setHasToneStarted] = useState(false);

  const stopSound = useCallback(() => {
    Tone.Transport.stop();
    Tone.Transport.cancel(); // Clear all scheduled events

    // Attempt to dispose of known objects if AI assigned them to window
    if (
      window.activeOracleLoop &&
      typeof window.activeOracleLoop.dispose === 'function'
    ) {
      window.activeOracleLoop.dispose();
      window.activeOracleLoop = undefined;
    }
    if (
      window.activeOracleSynth &&
      typeof window.activeOracleSynth.dispose === 'function'
    ) {
      window.activeOracleSynth.dispose();
      window.activeOracleSynth = undefined;
    }
    if (
      window.activeOracleEffect &&
      typeof window.activeOracleEffect.dispose === 'function'
    ) {
      window.activeOracleEffect.dispose();
      window.activeOracleEffect = undefined;
    }
    // Fallback: Dispose all sources connected to destination to be thorough,
    // though this might be too aggressive if other Tone.js sounds were meant to persist.
    // Tone.Destination.sources.forEach(source => source.dispose()); // Use with caution

    setIsPlaying(false);
    console.log('Sound stopped and transport cleared.');
  }, []);

  const playSound = useCallback(async () => {
    if (results?.soundCode) {
      try {
        if (!hasToneStarted) {
          await Tone.start();
          setHasToneStarted(true);
          console.log('Tone.js audio context started.');
        }

        // Stop and clear any previous sound/transport events
        stopSound();

        console.log('Executing sound code:', results.soundCode);
        // AI code should define and start its loop (e.g., loop.start(0))
        // and make main objects (synth, loop) available if possible (e.g., window.activeOracleSynth = synth)
        const soundGenerator = new Function('Tone', results.soundCode);
        soundGenerator(Tone);

        // The AI prompt guides the AI not to start Tone.Transport if scheduleRepeat is used.
        // If Tone.Loop is used with .start(0), it schedules on the transport.
        // We always start the transport here to ensure it runs.
        if (Tone.Transport.state !== 'started') {
          await Tone.Transport.start();
        }
        setIsPlaying(true);
        console.log('Sound code executed and transport started.');
      } catch (e) {
        console.error('Error playing sound code:', e);
        setIsPlaying(false);
      }
    }
  }, [results, hasToneStarted, stopSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, [stopSound]);

  // Effect to stop sound if results change (e.g., on reset)
  useEffect(() => {
    if (!results?.soundCode && isPlaying) {
      stopSound();
    }
  }, [results, isPlaying, stopSound]);

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
              className='md:col-span-2 flex justify-center'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className='question-card p-4 sm:p-6 mystical-glow text-center h-full flex flex-col max-w-md'>
                <CardHeader className='pb-2 sm:pb-3'>
                  <CardTitle className='text-xl sm:text-2xl font-semibold text-mystical-gold'></CardTitle>
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
            duration: 0.5,
          }}
        >
          <Card className='question-card p-6 sm:p-8 mystical-glow text-center'>
            <CardContent className='pt-4'>
              <div className='flex justify-center'>
                <motion.div
                  className='w-28 h-28 sm:w-32 sm:h-32 p-2 bg-white rounded-xl shadow-lg border-2 border-mystical-gold flex items-center justify-center overflow-hidden'
                  animate={{
                    rotateZ: [0, 360],
                  }}
                  transition={{
                    rotateZ: {
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
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

        {/* Sound Controls Card - NEW */}
        {results.soundCode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: results.tarotCardSvgString ? 0.6 : 0.4,
              duration: 0.5,
            }}
          >
            <Card className='question-card p-6 sm:p-8 mystical-glow'>
              <CardContent className='pt-2 flex flex-col items-center space-y-4'>
                <p className='text-sm text-cosmic-300 text-center mb-2'>
                  {isPlaying
                    ? 'The echo resonates...'
                    : 'Evoke the sonic echo.'}
                </p>
                <div className='flex space-x-4'>
                  <button
                    onClick={playSound}
                    disabled={isPlaying}
                    className='px-6 py-2 bg-mystical-gold text-cosmic-900 font-semibold rounded-lg shadow-md hover:bg-mystical-lightGold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-mystical-pearl focus:ring-offset-2 focus:ring-offset-cosmic-800 disabled:opacity-50'
                  >
                    Play Echo
                  </button>
                  <button
                    onClick={stopSound}
                    disabled={!isPlaying}
                    className='px-6 py-2 bg-cosmic-600 text-mystical-pearl font-semibold rounded-lg shadow-md hover:bg-cosmic-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-mystical-pearl focus:ring-offset-2 focus:ring-offset-cosmic-800 disabled:opacity-50'
                  >
                    Silence Echo
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Reset Button */}
        <motion.div
          className='text-center mt-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: results.tarotCardSvgString ? 0.7 : 0.5,
            duration: 0.5,
          }}
        >
          <button
            onClick={() => {
              stopSound(); // Stop sound before resetting
              onReset();
            }}
            className='px-8 py-3 bg-mystical-gold text-cosmic-900 font-semibold rounded-lg shadow-md hover:bg-mystical-lightGold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-mystical-pearl focus:ring-offset-2 focus:ring-offset-cosmic-800 text-2xl'
          >
            🔄
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
