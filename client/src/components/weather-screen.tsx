import { motion } from "framer-motion";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface WeatherScreenProps {
  onSubmit: (weatherInput: string) => void;
}

export function WeatherScreen({ onSubmit }: WeatherScreenProps) {
  const [weatherInput, setWeatherInput] = useState("");

  const handleSubmit = () => {
    if (weatherInput.trim()) {
      onSubmit(weatherInput.trim());
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
            The Final Whisper
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-cosmic-200 mb-8"
          >
            How does the atmosphere around you feel in this moment?
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <Textarea
              placeholder="Describe the energy you sense..."
              value={weatherInput}
              onChange={(e) => setWeatherInput(e.target.value)}
              className="w-full p-4 bg-cosmic-800/50 border border-cosmic-600 rounded-xl text-mystical-pearl placeholder-cosmic-400 focus:border-mystical-gold focus:outline-none transition-all resize-none min-h-[120px]"
              rows={4}
            />
            
            <Button
              onClick={handleSubmit}
              disabled={!weatherInput.trim()}
              className="w-full answer-button p-4 rounded-xl font-medium text-mystical-gold hover:text-mystical-lightGold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete the Journey
            </Button>
          </motion.div>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-cosmic-400">
          <div className="w-2 h-2 bg-cosmic-600 rounded-full"></div>
          <div className="w-2 h-2 bg-cosmic-600 rounded-full"></div>
          <div className="w-2 h-2 bg-mystical-gold rounded-full"></div>
        </div>
      </div>
    </motion.div>
  );
}
