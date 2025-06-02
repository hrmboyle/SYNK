import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className='min-h-screen flex flex-col items-center justify-center p-6'
    >
      <div className='text-center space-y-8'>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className='text-4xl md:text-6xl font-light tracking-wider text-mystical-gold mb-4'
        ></motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className='text-lg md:text-xl text-cosmic-300 max-w-md mx-auto leading-relaxed'
        >
          {/* You can add a descriptive tagline here if you wish */}
        </motion.p>

        {/* Sacred Yin-Yang Entry Point */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className='flex justify-center mt-12'
        >
          <motion.div
            // The .yin-yang class from your index.css defines the main structure
            // It should have `position: relative;` for z-index on children to work as expected.
            className='yin-yang mystical-glow cursor-pointer'
            onClick={onStart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              rotateZ: [0, 360],
              y: [0, -10, 0],
            }}
            transition={{
              rotateZ: { duration: 20, repeat: Infinity, ease: 'linear' },
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            {/* Added z-10 to this container to lift the dots above pseudo-elements */}
            <div className='absolute inset-0 flex items-center justify-center z-10'>
              {/* Dot in the dark area (created by ::before pseudo-element, typically top-left part of the swirl) should be light */}
              <div className='w-3 h-3 bg-mystical-pearl rounded-full absolute top-7 left-1/2 transform -translate-x-1/2'></div>
              {/* Dot in the light area (created by ::after pseudo-element, typically bottom-right part of the swirl) should be dark */}
              <div className='w-3 h-3 bg-cosmic-800 rounded-full absolute bottom-7 left-1/2 transform -translate-x-1/2'></div>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className='text-sm text-cosmic-400 animate-pulse'
        ></motion.p>
      </div>
    </motion.div>
  );
}
