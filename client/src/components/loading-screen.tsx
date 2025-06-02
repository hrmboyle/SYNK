import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  message?: string;
}

// Updated with mystic Unicode symbols
const loadingMessages = [
  '✧', // White Four Pointed Star
  '❖', // Black Diamond Minus White X
  '◈', // White Diamond Containing Black Small Diamond
  '△', // White Up-Pointing Triangle
  '◎', // Bullseye
  '🜁', // Alchemical Symbol for Air
  '⊕', // Circled Plus / Earth Symbol
  '✧', // Loop back to the start or add more
];

export function LoadingScreen({ message }: LoadingScreenProps) {
  const [currentMessage, setCurrentMessage] = useState(
    message || loadingMessages[0]
  );

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      setCurrentMessage(loadingMessages[index % loadingMessages.length]);
      index++;
    }, 200); // You can adjust the speed (200ms) if you like

    return () => clearInterval(interval);
  }, [message]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='min-h-screen flex flex-col items-center justify-center p-6'
    >
      <div className='text-center space-y-8'>
        <motion.div
          className='loading-orb mx-auto mystical-glow'
          animate={{
            rotateZ: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotateZ: { duration: 4, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        <motion.p
          key={currentMessage} // key helps Framer Motion animate changes
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }} // Faster transition for message change
          className='text-lg text-cosmic-300'
        >
          {currentMessage}
        </motion.p>
      </div>
    </motion.div>
  );
}
