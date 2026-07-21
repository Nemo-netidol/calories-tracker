import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const FOOD_RESPONSE_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      name: { type: "string" },
      calories: { type: "number" },
      protein: { type: "number" },
      carbs: { type: "number" },
      fat: { type: "number" },
      category: { type: "string", format: "enum", enum: ["Breakfast", "Lunch", "Dinner", "Snack"] },
      date: { type: "string" },
      time: { type: "string" }
    },
    required: ["name", "calories", "protein", "carbs", "fat", "category"]
  }
} as const;

const VALID_CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

/** Turns a Gemini SDK error into a short, user-facing message instead of a generic fallback. */
function describeGeminiError(error: unknown): string {
  const status = (error as { status?: number } | null)?.status;

  if (status === 503) return "The nutrition AI is experiencing high demand right now. Please try again in a moment.";
  if (status === 429) return "The nutrition AI is rate-limited right now. Please wait a moment and try again.";
  if (status === 401 || status === 403) return "The nutrition AI couldn't authenticate. Please check the app's configuration.";

  const rawMessage = error instanceof Error ? error.message : String(error);
  try {
    const apiMessage = JSON.parse(rawMessage)?.error?.message;
    if (apiMessage) return apiMessage;
  } catch {
    // rawMessage wasn't JSON — fall through to the generic message below.
  }
  return "Something went wrong talking to the nutrition assistant. Please try again.";
}

/** Coerces whatever category string the model returns into one of the app's fixed categories, defaulting to "Snack". */
export function normalizeCategory(category: unknown): "Breakfast" | "Lunch" | "Dinner" | "Snack" {
  const match = VALID_CATEGORIES.find((c) => c.toLowerCase() === String(category).trim().toLowerCase());
  return match || "Snack";
}

export async function getAIResponse(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are a meticulous nutrition expert. Today is ${new Date().toLocaleDateString()}. Read the user's message and extract each food item they consumed.

For each item, first estimate its likely ingredients and portion size in grams, then calculate calories, protein, carbs, and fat from that breakdown rather than guessing a total directly. Use calibration anchors such as: 1 cup cooked rice (≈200g) ≈ 260 kcal; 1 medium chicken breast (≈150g) ≈ 250 kcal; 1 tbsp cooking oil (≈14g) ≈ 120 kcal. Don't round up for hidden oil, sauce, or sugar unless the user mentions it — when uncertain, report your low-to-likely estimate rather than a high one.

Respond with a JSON array of food items in the format: [{ "name": "Food Name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "category": "Category", "date": "YYYY-MM-DD", "time": "HH:MM AM/PM" }]. Do not include any other text. There are no any menu including pork so don't calculate pork menu and return food name in Thai language`,
        responseSchema: FOOD_RESPONSE_SCHEMA,
        responseMimeType: "application/json"
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return describeGeminiError(error);
  }
}

export async function getAIResponseFromImage(base64Data: string, mimeType: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType, data: base64Data } },
            {
              text: `You are a meticulous nutrition expert analyzing a food photo. Today is ${new Date().toLocaleDateString()}.

Work through this in two steps before answering:
1. Identify every distinct food item visible. For each item, list its likely ingredients and estimate the portion weight in grams, anchoring the estimate to a visible reference in the photo (a fork or spoon ≈ 15-20cm, a standard dinner plate ≈ 25-27cm across, a palm-sized portion ≈ 100g) whenever one is visible.
2. Calculate calories, protein, carbs, and fat for each ingredient from its estimated grams, then sum to a total per food item. Use calibration anchors such as: 1 cup cooked rice (≈200g) ≈ 260 kcal; 1 medium chicken breast (≈150g) ≈ 250 kcal; 1 tbsp cooking oil (≈14g) ≈ 120 kcal.

Don't round portion sizes or hidden oil/sauce up "to be safe" — estimate only what's visibly there, and when uncertain, report your low-to-likely estimate rather than a high one; photo-based estimates are far more often too high than too low.

Respond with a JSON array of food items in the format: [{ "name": "Food Name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "category": "Category", "date": "YYYY-MM-DD", "time": "HH:MM AM/PM" }]. Do not include any other text.`
            }
          ]
        }
      ],
      config: {
        responseSchema: FOOD_RESPONSE_SCHEMA,
        responseMimeType: "application/json"
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return null;
  }
}

/** Parses a Gemini food-detection response into raw item objects, tolerating responses that aren't pure JSON. */
export function parseFoodItemsFromAIResponse(responseText: string): any[] | null {
  try {
    const parsed = JSON.parse(responseText.trim());
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    const jsonMatch = responseText.match(/\[\s*\{.*\}\s*\]/s) || responseText.match(/\{\s*".*\}\s*/s);
    if (jsonMatch) {
      try {
        const rawJson = jsonMatch[0].replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(rawJson);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (innerE) {
        console.error("Failed to parse JSON from AI response:", innerE);
        return null;
      }
    }
    return null;
  }
}
