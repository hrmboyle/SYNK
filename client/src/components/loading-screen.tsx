import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  message?: string;
}

const loadingMessages = [
  "Consulting the cosmic wisdom...",
  "Aligning with celestial energies...",
  "Weaving your destiny tapestry...",
  "Channeling ancient knowledge...",
  "Interpreting the sacred symbols..."
];

export function LoadingScreen({ message }: LoadingScreenProps) {
  const [currentMessage, setCurrentMessage] = useState(message || loadingMessages[0]);

  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      return;
    }

    const interval = setInterval(() => {
      setCurrentMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }, 2000);

    return () => clearInterval(interval);
  }, [message]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      <div className="text-center space-y-8">
        <motion.div
          className="loading-orb mx-auto mystical-glow"
          animate={{ 
            rotateZ: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotateZ: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        
        <motion.p
          key={currentMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-lg text-cosmic-300"
        >
          {currentMessage}
        </motion.p>
      </div>
    </motion.div>
  );
}
