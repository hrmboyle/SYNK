import { motion } from "framer-motion";

interface SigilScreenProps {
  sigils: string[];
  onSelectSigil: (sigil: string) => void;
}

export function SigilScreen({ sigils, onSelectSigil }: SigilScreenProps) {
  const renderSigil = (index: number) => {
    if (index === 0) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-mystical-pearl" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>
        </div>
      );
    } else {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-4 border-2 border-mystical-pearl rounded-full" style={{ transform: "rotate(45deg)" }}></div>
          <div className="w-8 h-4 border-2 border-mystical-pearl rounded-full" style={{ transform: "rotate(-45deg)" }}></div>
        </div>
      );
    }
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
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-light text-mystical-gold mb-6"
          >
            Choose Your Sacred Symbol
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-cosmic-200 mb-8"
          >
            Which sigil resonates with your inner truth?
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center space-x-8"
          >
            {sigils.map((sigil, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.2 }}
                className="text-center space-y-4"
              >
                <motion.div
                  className="sigil mx-auto cursor-pointer"
                  onClick={() => onSelectSigil(sigil)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{ 
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }
                  }}
                >
                  {renderSigil(index)}
                </motion.div>

              </motion.div>
            ))}
          </motion.div>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-cosmic-400">
          <div className="w-2 h-2 bg-cosmic-600 rounded-full"></div>
          <div className="w-2 h-2 bg-mystical-gold rounded-full"></div>
          <div className="w-2 h-2 bg-cosmic-600 rounded-full"></div>
        </div>
      </div>
    </motion.div>
  );
}
