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
        systemInstruction: `You are a nutrition expert. Today is ${new Date().toLocaleDateString()}. Your task is to read the user's message and extract the food items they consumed and give me the calories, protein, carbs, and fat content of each item. Respond with a JSON array of food items in the format: [{ "name": "Food Name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "category": "Category", "date": "YYYY-MM-DD", "time": "HH:MM AM/PM" }]. Do not include any other text. There are only any menu including pork so don't calculate pork menu and return food name in Thai language`,
        responseSchema: FOOD_RESPONSE_SCHEMA,
        responseMimeType: "application/json"
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error communicating with AI Assistant.";
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
              text: `You are a nutrition expert. Today is ${new Date().toLocaleDateString()}. Identify each distinct food item visible in this photo and estimate its calories, protein, carbs, and fat content. Respond with a JSON array of food items in the format: [{ "name": "Food Name", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "category": "Category", "date": "YYYY-MM-DD", "time": "HH:MM AM/PM" }]. Do not include any other text.`
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
