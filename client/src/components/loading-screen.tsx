import { motion } from 'framer-motion';
// Removed useEffect and useState as they are no longer needed for cycling messages

interface LoadingScreenProps {
  // message prop is removed as we are not displaying text
}

export function LoadingScreen({}: LoadingScreenProps) {
  // message prop removed here
  // Removed currentMessage state and the useEffect for cycling messages

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

        {/* The motion.p element for displaying messages has been removed */}
      </div>
    </motion.div>
  );
}
