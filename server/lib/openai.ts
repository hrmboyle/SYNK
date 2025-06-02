import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Only run dotenv.config() in local development
if (process.env.IS_LOCAL_SERVER === 'true') {
  dotenv.config();
}

// dotenv.config() // This line was duplicated, ensure it's only called if needed or once globally.
                // If IS_LOCAL_SERVER check above handles it, this might be redundant.
                // For now, I'll keep it as it was in your provided snippet, but it's worth reviewing.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("FATAL ERROR: GEMINI_API_KEY is not set in environment variables. Please ensure it's in your .env file and the server is restarted.");
  throw new Error("GEMINI_API_KEY is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateRiddle(): Promise<{
  riddle: string;
  answers: string[];
}> {
  try {
    const prompt = `Create an abstract riddle like a zen koan, less than 50 words. Avoid references to "you" or the individual self. Focus on universal concepts. Also provide exactly two cryptic, poetic answers that could both be valid interpretations. Return JSON with 'riddle' and 'answers' array containing exactly 2 strings.`;

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[2];
      const parsed = JSON.parse(jsonString);
      return {
        riddle: parsed.riddle || "What flows like water yet burns like fire?",
        answers: parsed.answers && parsed.answers.length === 2 ? parsed.answers : ["The whispers of ancient wisdom", "The dance of shadows beneath moonlight"]
      };
    }

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
    const prompt = `Based on this riddle answer:"${riddleAnswer}", generate exactly 2 simple, abstract, 2D sigil images suitable for mystical interpretation. Each image should be a self-contained SVG string featuring black symbols on a white background. Ensure the SVGs have a viewBox="0 0 50 50" and are complete, valid SVG elements. Return these as a JSON object with a key "sigils" containing an array of exactly 2 SVG strings. For example: {"sigils": ["<svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><rect width='50' height='50' fill='white'/><circle cx='25' cy='25' r='15' stroke='black' stroke-width='2' fill='none'/></svg>", "<svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><rect width='50' height='50' fill='white'/><path d='M10 10 L40 40 M10 40 L40 10' stroke='black' stroke-width='2'/></svg>"]}.`;

    console.log("Attempting to generate sigils with prompt for riddle answer:", riddleAnswer);

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI response for sigils:", text);

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[2];
      console.log("Extracted JSON string for sigils:", jsonString);
      const parsed = JSON.parse(jsonString);
      console.log("Parsed AI response for sigils:", parsed);

      if (Array.isArray(parsed.sigils) && parsed.sigils.length === 2 && parsed.sigils.every((s: any) => typeof s === 'string')) {
        return parsed.sigils;
      }
    }

    console.warn("AI did not return valid SVG strings for sigils, using fallback (black on white).");
    return [
      "<svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><rect width='50' height='50' fill='white'/><circle cx='25' cy='25' r='15' stroke='black' stroke-width='2' fill='none'/></svg>",
      "<svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><rect width='50' height='50' fill='white'/><path d='M15 15 L35 35 M15 35 L35 15' stroke='black' stroke-width='2'/></svg>"
    ];
  } catch (error) {
    console.error("Error in generateSigils function:", error);
    return [
      "<svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><rect width='50' height='50' fill='white'/><circle cx='25' cy='25' r='15' stroke='black' stroke-width='2' fill='none'/></svg>",
      "<svg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'><rect width='50' height='50' fill='white'/><path d='M15 15 L35 35 M15 35 L35 15' stroke='black' stroke-width='2'/></svg>"
    ];
  }
}

export async function generateTarotCardImage(cardName: string): Promise<string | null> {
  try {
    const prompt = `Generate a simple, abstract, and mystical SVG image representing the Tarot card '${cardName}'. The style should be primarily black and white, suitable for a small icon or display. The SVG should be self-contained, with a viewBox, for example, "0 0 100 150" (portrait aspect ratio) or "0 0 80 80" (square, if more suitable for abstract representation) and include a white background rectangle as its first element. Return a JSON object with a key "tarotCardSvg" containing the single SVG string. For example: {"tarotCardSvg": "<svg viewBox='0 0 100 150' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='150' fill='white'/><text x='50' y='75' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='12' fill='black'>${cardName} - Abstract Symbol</text></svg>"}. Focus on symbolic representation rather than detailed illustration.`;

    console.log("Attempting to generate Tarot card SVG with prompt:", prompt);

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI response for Tarot card SVG:", text);

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[2];
      const parsed = JSON.parse(jsonString);
      if (parsed.tarotCardSvg && typeof parsed.tarotCardSvg === 'string') {
        return parsed.tarotCardSvg;
      }
    }

    console.warn("AI did not return a valid SVG string for the Tarot card, using fallback.");
    return `<svg viewBox='0 0 100 150' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='150' fill='white' stroke='black' stroke-width='1'/><text x='50' y='70' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='10' fill='black'>${cardName}</text><text x='50' y='90' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='8' fill='black'>(Symbolic)</text></svg>`;

  } catch (error) {
    console.error("Error in generateTarotCardImage (SVG) function:", error);
    return `<svg viewBox='0 0 100 150' xmlns='http://www.w3.org/2000/svg'><rect width='100' height='150' fill='white' stroke='black' stroke-width='1'/><text x='50' y='75' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='10' fill='black'>Error: ${cardName}</text></svg>`;
  }
}

// Modified function to only generate a mantra
export async function generateMantra( // Renamed function and changed return type
  riddleAnswer: string,
  selectedSigil: string,
  cardValue: string // This is the Tarot card name
): Promise<{ mantra: string }> { // Return type only contains mantra
  try {
    const prompt = `Based on these elements:
    - Riddle answer: "${riddleAnswer}"
    - Chosen sigil: A visual symbol (represented by a short SVG description like "${selectedSigil.substring(0, 50)}...")
    - Card drawn: "${cardValue}" (e.g., The Fool, Ace of Wands)

    Create a mantra (4-6 lines, poetic, uplifting) that weaves these elements together. Avoid using "you" or "your" - focus on universal themes and timeless wisdom. Return JSON with a 'mantra' string.`; // Updated prompt

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[2];
      const parsed = JSON.parse(jsonString);
      return { // Return only mantra
        mantra: parsed.mantra || "In the sacred dance of light and shadow, truth emerges."
      };
    }

    return { // Fallback only for mantra
      mantra: "In balance and wisdom, the path unfolds."
    };
  } catch (error) {
    console.error("Error generating mantra:", error); // Updated error message
    return { // Fallback only for mantra
      mantra: "In balance and wisdom, the path unfolds."
    };
  }
}

// generateSongPrompt function remains commented out as per your previous changes
// export async function generateSongPrompt(
//   riddleAnswer: string,
//   selectedSigil: string,
//   cardValue: string, // Tarot card name
//   mantra: string
// ): Promise<string> {
//   // ... implementation ...
// }