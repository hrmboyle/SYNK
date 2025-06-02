import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure your GEMINI_API_KEY is correctly set in your environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "-"); // Fallback key is likely a placeholder
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateRiddle(): Promise<{
  riddle: string;
  answers: string[];
}> {
  try {
    const prompt = `Create an abstract riddle like a zen koan, less than 50 words. Avoid references to "you" or the individual self. Focus on universal concepts. Also provide exactly two cryptic, poetic answers that could both be valid interpretations. Return JSON with 'riddle' and 'answers' array containing exactly 2 strings.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[2]; // Use the captured group from either markdown code block or plain JSON
      const parsed = JSON.parse(jsonString);
      return {
        riddle: parsed.riddle || "What flows like water yet burns like fire?",
        answers: parsed.answers && parsed.answers.length === 2 ? parsed.answers : ["The whispers of ancient wisdom", "The dance of shadows beneath moonlight"]
      };
    }
    
    // Fallback
    return {
      riddle: "What grows stronger when divided, yet weakens when whole?",
      answers: ["The mirror of consciousness", "The flame of understanding"]
    };
  } catch (error) {
    console.error("Error generating riddle:", error);
    return {
      riddle: "What grows stronger when divided, yet weakens when whole?",
      answers: ["The mirror of consciousness", "The flame of understanding"]
    };
  }
}

export async function generateSigils(riddleAnswer: string): Promise<string[]> {
  try {
    // Updated prompt to request SVG strings
    const prompt = `Based on this riddle answer: "${riddleAnswer}", generate exactly 2 simple, abstract, mythically random sigil images as self-contained SVG strings. Each SVG should be a complete, valid SVG element with a viewBox="0 0 50 50" and use 'white' for strokes or fills on a transparent background, suitable for a mystical theme. Return these as a JSON object with a key "sigils" containing an array of exactly 2 SVG strings. For example: {"sigils": ["<svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><circle cx='25' cy='25' r='20' stroke='white' stroke-width='2' fill='transparent'/></svg>", "<svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><rect x='10' y='10' width='30' height='30' stroke='white' stroke-width='2' fill='transparent'/></svg>"]}.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Enhanced JSON extraction to handle potential markdown code blocks
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[2]; // Use the captured group from either markdown code block or plain JSON
      const parsed = JSON.parse(jsonString);
      // Ensure 'sigils' is an array of two strings (SVG content)
      if (Array.isArray(parsed.sigils) && parsed.sigils.length === 2 && parsed.sigils.every((s: any) => typeof s === 'string')) {
        return parsed.sigils;
      }
    }
    
    // Updated Fallback to provide simple SVG strings
    console.warn("AI did not return valid SVG strings for sigils, using fallback.");
    return [
      "<svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><circle cx='25' cy='25' r='20' stroke='white' stroke-width='2' fill='transparent'/><circle cx='25' cy='25' r='5' fill='white'/></svg>",
      "<svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><polygon points='25,5 45,45 5,45' stroke='white' stroke-width='2' fill='transparent'/></svg>"
    ];
  } catch (error) {
    console.error("Error generating sigils:", error);
    // Fallback in case of error
    return [
      "<svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><circle cx='25' cy='25' r='20' stroke='white' stroke-width='2' fill='transparent'/><circle cx='25' cy='25' r='5' fill='white'/></svg>",
      "<svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><polygon points='25,5 45,45 5,45' stroke='white' stroke-width='2' fill='transparent'/></svg>"
    ];
  }
}

export async function generateMantraAndPoem(
  riddleAnswer: string,
  selectedSigil: string, // This will now be an SVG string; consider if the prompt needs just a description or can handle SVG.
                         // For now, assuming the selectedSigil string (SVG) might be too verbose for the prompt.
                         // It might be better to use the *description* of the sigil if you still have it,
                         // or a generic placeholder if the SVG string itself is passed here.
                         // For this iteration, I'll assume the `selectedSigil` variable will be handled appropriately
                         // before being interpolated into the prompt, or the AI can interpret/ignore verbose SVG.
  cardValue: string
): Promise<{
  mantra: string;
  poem: string;
}> {
  try {
    // Consider if the full SVG string for 'selectedSigil' is appropriate here, or if you need its original name/description.
    // If `selectedSigil` is a very long SVG string, it might make the prompt too long or confuse the AI.
    // You might want to pass a generic term like "the chosen symbol" or its original AI-generated name if you store that.
    // For now, the prompt uses it directly.
    const prompt = `Based on these elements:
    - Riddle answer: "${riddleAnswer}"
    - Chosen sigil: A symbol represented by "${selectedSigil.substring(0, 50)}..." (Description of a visual symbol)
    - Card drawn: "${cardValue}"
    
    Create a mantra (4-6 lines, poetic, uplifting) and a longer poem (8-12 lines) that weaves these elements together. Avoid using "you" or "your" - focus on universal themes and timeless wisdom. Return JSON with 'mantra' and 'poem' strings.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[2];
      const parsed = JSON.parse(jsonString);
      return {
        mantra: parsed.mantra || "In the sacred dance of light and shadow, truth emerges.",
        poem: parsed.poem || "Through ancient wisdom flowing free, understanding blooms eternally."
      };
    }
    
    return {
      mantra: "In balance and wisdom, the path unfolds.",
      poem: "The journey within reveals the light, guiding through eternal night."
    };
  } catch (error) {
    console.error("Error generating mantra and poem:", error);
    return {
      mantra: "In balance and wisdom, the path unfolds.",
      poem: "The journey within reveals the light, guiding through eternal night."
    };
  }
}

export async function generateSongPrompt(
  riddleAnswer: string,
  selectedSigil: string, // Similar consideration as above for SVG string length/content
  cardValue: string,
  mantra: string
): Promise<string> {
  try {
    const prompt = `Create a song prompt for Suno AI based on these elements:
    - Riddle answer: "${riddleAnswer}"
    - Chosen sigil: A symbol represented by "${selectedSigil.substring(0,50)}..." (Description of a visual symbol)
    - Card drawn: "${cardValue}"
    - Mantra: "${mantra}"
    
    Create a prompt that captures the essence in ambient/new age style. Include genre, mood, instruments, and thematic elements. Keep it under 200 characters for Suno compatibility.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text.replace(/```json\s*|\s*```|```/g, "").trim() || "Ambient mystical meditation music with ethereal vocals, reflecting spiritual awakening and inner wisdom";
  } catch (error) {
    console.error("Error generating song prompt:", error);
    return "Ethereal ambient track with mystical undertones, perfect for meditation and spiritual reflection";
  }
}