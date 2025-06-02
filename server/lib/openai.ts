import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyA1yp_TzbXovKEfKsxYBWV-LUFuiQ7zE6Y");
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
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        riddle: parsed.riddle || "What flows like water yet burns like fire?",
        answers: parsed.answers || ["The whispers of ancient wisdom", "The dance of shadows beneath moonlight"]
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
    const prompt = `Based on this riddle answer: "${riddleAnswer}", create exactly 2 simple geometric sigil descriptions. Each should be a short name/title that represents the essence. Return JSON with 'sigils' array containing exactly 2 strings.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.sigils || ["The Circle of Infinite Wisdom", "The Twin Triangles of Balance"];
    }
    
    return ["Sacred Geometry", "Eternal Symbol"];
  } catch (error) {
    console.error("Error generating sigils:", error);
    return ["Sacred Geometry", "Eternal Symbol"];
  }
}

export async function generateMantraAndPoem(
  riddleAnswer: string,
  selectedSigil: string,
  cardValue: string
): Promise<{
  mantra: string;
  poem: string;
}> {
  try {
    const prompt = `Based on these elements:
    - Riddle answer: "${riddleAnswer}"
    - Chosen sigil: "${selectedSigil}"
    - Card drawn: "${cardValue}"
    
    Create a mantra (4-6 lines, poetic, uplifting) and a longer poem (8-12 lines) that weaves these elements together. Avoid using "you" or "your" - focus on universal themes and timeless wisdom. Return JSON with 'mantra' and 'poem' strings.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
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
  selectedSigil: string,
  cardValue: string,
  mantra: string
): Promise<string> {
  try {
    const prompt = `Create a song prompt for Suno AI based on these elements:
    - Riddle answer: "${riddleAnswer}"
    - Chosen sigil: "${selectedSigil}"
    - Card drawn: "${cardValue}"
    - Mantra: "${mantra}"
    
    Create a prompt that captures the essence in ambient/new age style. Include genre, mood, instruments, and thematic elements. Keep it under 200 characters for Suno compatibility.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text || "Ambient mystical meditation music with ethereal vocals, reflecting spiritual awakening and inner wisdom";
  } catch (error) {
    console.error("Error generating song prompt:", error);
    return "Ethereal ambient track with mystical undertones, perfect for meditation and spiritual reflection";
  }
}
