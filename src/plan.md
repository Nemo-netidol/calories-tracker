# Plan: Fixing Gemini Food Photo Nutrition Overestimation

## Problem
Gemini API estimates nutrition from food photos but tends to overestimate calories/macros compared to real-world values. Root cause: Gemini is guessing portion size and calorie density from visual cues alone, with no grounding in verified nutrition data.

## Goal
Reduce overestimation by (1) improving prompting to reduce bias, and (2) grounding final nutrition numbers in a real food database instead of trusting Gemini's raw output.

---

## Phase 1: Prompting Fixes (quick wins, no architecture change)

- [x] **Force two-step breakdown**: prompt Gemini to first list identified ingredients + estimated weight in grams each, then calculate nutrition per ingredient — not the whole plate at once. *(`src/services/aiService.ts` — both `getAIResponse` and `getAIResponseFromImage`)*
- [x] **Add reference-object instruction**: ask it to estimate portion size relative to a visible reference (fork, plate diameter, palm-sized comparison) when possible. *(photo prompt only — no visual reference for the text-chat path)*
- [x] **Add calibration anchors (few-shot examples) in the system prompt**, e.g.:
  - "1 cup cooked rice ≈ 200g ≈ 260 kcal"
  - "1 medium chicken breast ≈ 150g ≈ 250 kcal"
- [x] **Request a range, not a point estimate**: ask for low/likely/high estimates, and use the "likely" or low-end value downstream rather than the model's default point estimate. *(handled as internal reasoning in the prompt — output schema unchanged, so no downstream parsing changes needed)*
- [x] **Explicitly instruct against overestimation bias**: e.g. "avoid rounding up for hidden oil/sauce unless clearly visible in the image."
- [ ] Test the updated prompt against 10-15 known meals (photos where you already know the real nutrition) and compare error before/after.

## Phase 2: Ground Output in a Real Food Database

Instead of trusting Gemini's raw nutrition numbers, use Gemini only for **identification**, and pull actual nutrition values from a verified source.

### Pipeline
1. **Gemini step**: identify ingredients + estimate portion weight (grams) per ingredient from the photo (output as structured JSON).
2. **Lookup step**: for each identified ingredient, query a food database API for verified nutrition per 100g.
3. **Calculation step**: multiply verified per-100g values by Gemini's estimated portion weight to get final calories/macros per ingredient, then sum for the full meal.
4. **Display step**: show the estimate to the user with an "edit if wrong" option — portion estimation is still the weakest link, so let users correct it.

### Database Options
| Source | Cost | Notes |
|---|---|---|
| **Thai Food Composition Database (Thai FCD)** — Institute of Nutrition, Mahidol University (INMU) | Free (research/reference database) | The authoritative Thai-specific source — lab-analyzed Thai dishes and ingredients, not just generic foods stretched to fit. Version 3 (Aug 2025). May not have a clean public REST API — check inmu.mahidol.ac.th for developer access or a downloadable dataset to self-host in TiDB. |
| Open Food Facts | Free, crowd-sourced | Global barcode/packaged-food data — good fallback for packaged snacks/drinks sold in Thailand that Thai FCD won't cover |
| USDA FoodData Central | Free | US-centric — weak for composite Thai dishes and Thai-specific ingredients. Use only as a last-resort fallback for generic base ingredients (plain rice, egg, chicken) where values are roughly universal |

**Recommendation (revised for Thai/Asian food)**: Use **Thai FCD as the primary source** since most meals are Thai dishes — check whether INMU offers an API or bulk data export you can import into TiDB. Fall back to **Open Food Facts** for packaged/branded items, and **USDA FoodData Central** only for generic non-Thai-specific ingredients.

**Reference point**: INMU has already built "INMU iFood," an AI-based Thai food dietary assessment system that estimates nutrition from food photos using their own validated Thai food composition database — worth a look as a working example of solving nearly this exact problem.

---

## Phase 3: Implementation Steps

- [ ] Check inmu.mahidol.ac.th for Thai FCD API access, bulk data export, or licensing terms for use in an app
- [ ] If Thai FCD has no usable API, import their dataset into a TiDB table you control (ingredient name, per-100g nutrients) for fast local lookup
- [ ] Get a free API key for USDA FoodData Central (api.data.gov) and Open Food Facts as fallbacks
- [ ] Update Gemini prompt to return structured JSON: `{ ingredient_name, estimated_grams }[]`
- [ ] Write a backend function that looks up each ingredient in this order: Thai FCD table → Open Food Facts → USDA FoodData Central, and maps results to your schema field names
- [ ] Write the aggregation logic: sum nutrition across all identified ingredients weighted by estimated grams
- [ ] Add an editable review screen in the frontend so users can correct portion sizes or swap misidentified ingredients before saving the log entry
- [ ] Log both Gemini's raw estimate and the database-grounded estimate for a sample of entries, to measure how much the grounding step improves accuracy over time

## Phase 4: Validation

- [ ] Pick 10-15 meals with known nutrition values (packaged food labels, restaurant nutrition pages, or home-cooked meals you've weighed)
- [ ] Compare: Gemini-only estimate vs. Gemini + database-grounded estimate vs. real value
- [ ] Track average % error for each method
- [ ] Iterate on prompt calibration anchors if error remains high after grounding

---

## Notes
- This is a v1 approach — the ingredient-identification step (Gemini) will still be the main source of error (misidentifying foods, misjudging portion size), not the database lookup itself.
- Consider letting users manually search-and-select from the database as a fallback when Gemini's identification confidence is low.