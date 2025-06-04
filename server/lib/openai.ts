import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Only run dotenv.config() in local development
if (process.env.IS_LOCAL_SERVER === 'true') {
  dotenv.config();
}

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

export async function generateMantra(
  riddleAnswer: string,
  selectedSigil: string, // This is an SVG string
  cardValue: string
): Promise<{ mantra: string }> {
  try {
    // Use a placeholder for the sigil in the prompt for brevity and clarity
    const sigilDescription = "a chosen mystical sigil";
    const prompt = `Based on these elements:
    - Riddle answer: "${riddleAnswer}"
    - Chosen sigil: ${sigilDescription}
    - Card drawn: "${cardValue}" (e.g., The Fool, Ace of Wands)

    Create a mantra (4-6 lines, poetic, uplifting) that weaves these elements together. Avoid using "you" or "your" - focus on universal themes and timeless wisdom. Return JSON with a 'mantra' string.`;

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[2];
      const parsed = JSON.parse(jsonString);
      return {
        mantra: parsed.mantra || "In the sacred dance of light and shadow, truth emerges."
      };
    }

    return {
      mantra: "In balance and wisdom, the path unfolds."
    };
  } catch (error) {
    console.error("Error generating mantra:", error);
    return {
      mantra: "In balance and wisdom, the path unfolds."
    };
  }
}


export async function generateAsciiArtForCard(cardName: string): Promise<string> {
  try {
    const prompt = `Generate a simple, abstract, and mystical piece of ASCII art representing the Tarot card '${cardName}'.
The art should be purely text-based.
The art should be designed to fit neatly within a block approximately 40 characters wide and 20 lines high. Do not exceed these dimensions.
Use characters like | - / \\ _ , . : ; ' " ( ) [ ] { } < > ! @ # $ % ^ & * + = ~ \` to create the art.
Return JSON with a key "asciiArtLines" containing an ARRAY of strings, where each string in the array is one line of the ASCII art.

For example, for "The Star":
{
  "asciiArtLines": [
    "    .",
    "   /|\\",
    "  /_|_\\",
    "   /|*|\\",
    "  /_|*_\\",
    " /_ |*_\\",
    " \\\\_|_|_/",
    "  /_ _ _\\",
    " (_______)"
  ]
}

Focus on abstract symbolism rather than detailed illustration.
Ensure the response is only the JSON object. The art should not contain any HTML or CSS.`;

    console.log("Attempting to generate ASCII art for card:", cardName);

    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI response for ASCII art:", text);

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```|(\{[\s\S]*\})/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[2];
      const parsed = JSON.parse(jsonString);
      if (parsed.asciiArtLines && Array.isArray(parsed.asciiArtLines) && parsed.asciiArtLines.every((line: any) => typeof line === 'string')) {
        return parsed.asciiArtLines.join('\n');
      }
    }

    console.warn("AI did not return valid ASCII art (array of lines), using fallback.");
    const fallbackArt = `
+------------------+
|                  |
|   [Fallback]     |
|       for        |
|   ${cardName.padEnd(14).substring(0, 14)}   |
|                  |
+------------------+
`;
    return fallbackArt.trim();
  } catch (error) {
    console.error("Error in generateAsciiArtForCard function (or parsing its response):", error);
    const errorArt = `
+------------------+
|                  |
|  Error Generating |
|       Art        |
|   ${cardName.padEnd(14).substring(0, 14)}   |
|                  |
+------------------+
`;
    return errorArt.trim();
  }
}

// NEW FUNCTION to generate Tone.js code
export async function generateSoundCode(
  riddleAnswer: string,
  selectedSigilSVG: string, // The actual SVG string, though we'll use a description in the prompt
  cardValue: string,
  mantra: string
): Promise<string | null> {
  try {
    // For the prompt, it's better to use a description of the sigil
    // rather than the full SVG, which can be very long.
    const sigilDescription = "a user-selected abstract mystical sigil";

    const prompt = `Based on these mystical inputs:
- Riddle Answer: "${riddleAnswer}"
- Sigil Theme: Reflects ${sigilDescription}
- Tarot Card: "${cardValue}"
- Mantra: "${mantra}"

Generate a JavaScript code snippet using Tone.js (version 14.x or compatible) that creates a unique, looping, ambient soundscape or a short musical motif (around 15-30 seconds per loop). The sound should evoke a sense of mystery, contemplation, or insight related to the inputs.

The code must:
1.  Be self-contained and executable in a browser environment where Tone.js (as 'Tone') is globally available.
2.  Create and start a loop (e.g., using \`new Tone.Loop(callback, interval).start(0)\` or \`Tone.Transport.scheduleRepeat(callback, interval)\`).
3.  Define its main sound elements (synths, players, effects etc.) and assign them to variables (e.g., \`const synth = ...;\`).
4.  The sound should loop indefinitely until explicitly stopped by external controls (e.g., by calling \`Tone.Transport.stop()\` and disposing of created Tone.js objects).
5.  If using \`Tone.Transport.scheduleRepeat\`, DO NOT call \`Tone.Transport.start()\` within this generated code snippet. The calling environment will handle starting the Transport. If using \`Tone.Loop(...).start(0)\`, this is acceptable as it links to the Transport.
6.  The generated code should be purely JavaScript for Tone.js, enclosed in a standard JavaScript code block. Do not include any other text, explanations, or JSON formatting around the code block itself.

Output ONLY the JavaScript code block.

Example of a valid structural output:
\`\`\`javascript
const synth = new Tone.FMSynth({
  harmonicity: 1.2,
  modulationIndex: 5,
  envelope: { attack: 0.2, decay: 0.5, sustain: 0.1, release: 1 },
  modulationEnvelope: { attack: 0.1, decay: 0.3, sustain: 0.05, release: 0.5 }
}).toDestination();
synth.volume.value = -12; // Quieter volume

const filter = new Tone.AutoFilter("2n").toDestination().start();
synth.connect(filter);

const loop = new Tone.Loop(time => {
  const notes = ["C3", "Eb3", "G3", "Bb3"];
  const note = notes[Math.floor(Math.random() * notes.length)];
  synth.triggerAttackRelease(note, "2n", time);
}, "1m").start(0);

// The calling environment will handle Tone.Transport.start()/stop()
// and disposing: loop.dispose(); synth.dispose(); filter.dispose();
\`\`\`
`;

    console.log("Attempting to generate sound code with prompt for card:", cardValue);
    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI response for sound code:", text);

    // Extract JavaScript code block
    const jsMatch = text.match(/```javascript\s*([\s\S]*?)\s*```/);
    if (jsMatch && jsMatch[1]) {
      console.log("Extracted sound code:", jsMatch[1]);
      return jsMatch[1].trim();
    }

    // Fallback if no ```javascript ``` block is found, try to find raw code
    // This is less reliable but can be a fallback.
    const rawCodeMatch = text.match(/^(?:const|let|var|new Tone\.|Tone\.Transport)/m);
    if (rawCodeMatch) {
        const potentialCode = text.substring(rawCodeMatch.index || 0);
        // Very basic validation: check for common Tone.js keywords
        if (potentialCode.includes("Tone.") && (potentialCode.includes("Synth") || potentialCode.includes("Loop") || potentialCode.includes("Transport"))) {
            console.warn("Found sound code without standard markdown block, attempting to use as is.");
            return potentialCode.trim();
        }
    }


    console.warn("AI did not return valid JavaScript code for sound, using fallback.");
    // Fallback Tone.js code
    return `
const synth = new Tone.Synth().toDestination();
const loop = new Tone.Loop(time => {
  synth.triggerAttackRelease("C4", "8n", time);
}, "4n").start(0);
// Calling environment handles Tone.Transport.start()
    `.trim();

  } catch (error) {
    console.error("Error in generateSoundCode function:", error);
    // Fallback Tone.js code in case of error
    return `
const synth = new Tone.Synth().toDestination();
const loop = new Tone.Loop(time => {
  synth.triggerAttackRelease("E4", "4n", time);
}, "2n").start(0);
// Calling environment handles Tone.Transport.start()
    `.trim();
  }
}