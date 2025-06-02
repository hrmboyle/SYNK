import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export async function generateRiddle(): Promise<{
  riddle: string;
  answers: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a mystical oracle that creates zen-like koans and riddles. Create abstract, philosophical riddles that make people think deeply. Always respond with valid JSON."
        },
        {
          role: "user",
          content: "Create a mystical riddle that is abstract like a zen koan, less than 50 words. Also provide exactly two cryptic, poetic answers that could both be valid interpretations. Return JSON with 'riddle' and 'answers' array containing exactly 2 strings."
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      riddle: result.riddle || "What flows like water yet burns like fire?",
      answers: result.answers || ["The whispers of ancient wisdom", "The dance of shadows beneath moonlight"]
    };
  } catch (error) {
    console.error("Error generating riddle:", error);
    // Fallback riddle
    return {
      riddle: "What grows stronger when divided, yet weakens when whole?",
      answers: ["The mirror of consciousness", "The flame of understanding"]
    };
  }
}

export async function generateSigils(riddleAnswer: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        {
          role: "system",
          content: "You are a mystical symbol creator. Generate simple, geometric sigil descriptions that can be rendered with basic shapes. Always respond with valid JSON."
        },
        {
          role: "user",
          content: `Based on this riddle answer: "${riddleAnswer}", create exactly 2 simple geometric sigil descriptions. Each should be a short name/title that represents the essence. Return JSON with 'sigils' array containing exactly 2 strings.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return result.sigils || ["The Circle of Infinite Wisdom", "The Twin Triangles of Balance"];
  } catch (error) {
    console.error("Error generating sigils:", error);
    return ["Sacred Geometry", "Eternal Symbol"];
  }
}

export async function generateMantraAndPoem(
  riddleAnswer: string,
  selectedSigil: string,
  weatherInput: string
): Promise<{
  mantra: string;
  poem: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a mystical poet and spiritual guide. Create beautiful, meaningful mantras and poems based on user's spiritual journey. Always respond with valid JSON."
        },
        {
          role: "user",
          content: `Based on this spiritual journey:
          - Riddle answer: "${riddleAnswer}"
          - Chosen sigil: "${selectedSigil}"
          - Inner weather: "${weatherInput}"
          
          Create a personal mantra (4-6 lines, poetic, uplifting) and a longer poem (8-12 lines) that weaves these elements together. Return JSON with 'mantra' and 'poem' strings.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      mantra: result.mantra || "In the sacred dance of light and shadow, I find my truth.",
      poem: result.poem || "Through ancient wisdom flowing free, I discover what I'm meant to be."
    };
  } catch (error) {
    console.error("Error generating mantra and poem:", error);
    return {
      mantra: "In balance and wisdom, I find my path.",
      poem: "The journey within reveals the light, guiding me through eternal night."
    };
  }
}

export async function generateSongPrompt(
  riddleAnswer: string,
  selectedSigil: string,
  weatherInput: string,
  mantra: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a music prompt creator for AI song generation. Create detailed prompts for mystical, ambient, spiritual music based on user's spiritual journey."
        },
        {
          role: "user",
          content: `Create a song prompt for Suno AI based on this mystical journey:
          - Riddle answer: "${riddleAnswer}"
          - Chosen sigil: "${selectedSigil}"
          - Inner weather: "${weatherInput}"
          - Personal mantra: "${mantra}"
          
          Create a prompt that captures the spiritual essence in ambient/new age style. Include genre, mood, instruments, and thematic elements. Keep it under 200 characters for Suno compatibility.`
        }
      ],
    });

    return response.choices[0].message.content || "Ambient mystical meditation music with ethereal vocals, reflecting spiritual awakening and inner wisdom";
  } catch (error) {
    console.error("Error generating song prompt:", error);
    return "Ethereal ambient track with mystical undertones, perfect for meditation and spiritual reflection";
  }
}
