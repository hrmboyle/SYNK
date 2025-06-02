import { motion } from "framer-motion";

interface RiddleScreenProps {
  riddle: string;
  answers: string[];
  onSelectAnswer: (answer: string) => void;
}

export function RiddleScreen({ riddle, answers, onSelectAnswer }: RiddleScreenProps) {
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
            The Oracle Speaks
          </motion.h2>
          
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl leading-relaxed text-cosmic-200"
            >
              {riddle}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid gap-4 mt-8"
            >
              {answers.map((answer, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.2 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="answer-button p-4 rounded-xl text-left transition-all"
                  onClick={() => onSelectAnswer(answer)}
                >
                  <span className="text-mystical-gold font-medium">
                    {index === 0 ? "A:" : "B:"}
                  </span>
                  <span className="ml-2">{answer}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-cosmic-400">
          <div className="w-2 h-2 bg-mystical-gold rounded-full"></div>
          <div className="w-2 h-2 bg-cosmic-600 rounded-full"></div>
          <div className="w-2 h-2 bg-cosmic-600 rounded-full"></div>
        </div>
      </div>
    </motion.div>
  );
}
