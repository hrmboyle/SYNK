import { motion } from 'framer-motion';

interface SigilScreenProps {
  sigils: string[]; // Expected to be an array of SVG strings (black symbol on white background)
  onSelectSigil: (sigilSvgString: string) => void;
}

export function SigilScreen({ sigils, onSelectSigil }: SigilScreenProps) {
  // The renderSigil function is no longer needed as the sigil prop itself will be the SVG string.

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
            transition={{ delay: 0.6 }}
            className='flex flex-col sm:flex-row justify-center items-center sm:space-x-8 space-y-8 sm:space-y-0' // Adjusted for better responsive layout
          >
            {sigils.map((sigilSvgString, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                className='text-center space-y-2 flex flex-col items-center' // Reduced space-y for tighter look
              >
                <motion.div
                  // Container for the SVG.
                  // Styling ensures a consistent size and appearance for the AI-generated SVGs.
                  // The background is white to match the requested SVG style.
                  className='w-28 h-28 sm:w-32 sm:h-32 p-2 bg-white rounded-xl shadow-lg border-2 border-mystical-gold mx-auto cursor-pointer flex items-center justify-center overflow-hidden hover:shadow-2xl transition-all duration-300'
                  onClick={() => onSelectSigil(sigilSvgString)} // Pass the SVG string itself
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    y: [0, -4, 0], // Subtle bobbing animation
                  }}
                  transition={{
                    y: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.4,
                    },
                  }}
                >
                  {/* Render the SVG string. 
                      WARNING: dangerouslySetInnerHTML can be risky. 
                      Ensure your AI backend generates safe, sanitized SVG. 
                      The SVGs are expected to have viewBox="0 0 50 50".
                  */}
                  <div
                    dangerouslySetInnerHTML={{ __html: sigilSvgString }}
                    className='w-full h-full flex items-center justify-center'
                  />
                </motion.div>
                {/* Optional: If you want to display a generic label or the AI provides a name */}
                {/* <p className="text-xs text-cosmic-300 mt-1">Symbol {index + 1}</p> */}
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className='flex items-center justify-center space-x-2 text-cosmic-400'>
          <div className='w-2 h-2 bg-cosmic-600 rounded-full'></div>
          <div className='w-2 h-2 bg-mystical-gold rounded-full'></div>
          <div className='w-2 h-2 bg-cosmic-600 rounded-full'></div>
        </div>
      </div>
    </motion.div>
  );
}
