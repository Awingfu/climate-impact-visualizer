"use client";

import { useProfile } from "@/components/profile-provider";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { QuantityQuestion } from "@/components/calculator/quantity-question";
import { calculateFood, emissionFactors } from "@/climate";

const FREQUENCY_OPTIONS = [
  { label: "Never", value: 0 },
  { label: "1-2x / week", value: 1.5 },
  { label: "3-5x / week", value: 4 },
  { label: "Daily", value: 7 },
];

export default function FoodCalculatorPage() {
  const { profile, updateCategory } = useProfile();
  const result = calculateFood(profile.food, emissionFactors);

  return (
    <CalculatorShell
      path="/calculator/food"
      subtitle="We ask about meal frequency rather than exact food weights. Beef and lamb carry a much larger footprint per meal than chicken, vegetarian, or vegan options."
      categoryKgCo2ePerYear={result.kgCo2ePerYear}
    >
      <QuantityQuestion
        question="How often do you eat beef?"
        value={profile.food.beefMealsPerWeek}
        onChange={(v) => updateCategory("food", { beefMealsPerWeek: v })}
        quickOptions={FREQUENCY_OPTIONS}
        min={0}
        max={21}
        step={1}
        unit="meals / week"
      />

      <QuantityQuestion
        question="How often do you eat chicken or other poultry?"
        value={profile.food.chickenMealsPerWeek}
        onChange={(v) => updateCategory("food", { chickenMealsPerWeek: v })}
        quickOptions={FREQUENCY_OPTIONS}
        min={0}
        max={21}
        step={1}
        unit="meals / week"
      />

      <QuantityQuestion
        question="How often do you eat vegetarian meals?"
        helpText="Meatless, but may include dairy or eggs."
        value={profile.food.vegetarianMealsPerWeek}
        onChange={(v) => updateCategory("food", { vegetarianMealsPerWeek: v })}
        quickOptions={FREQUENCY_OPTIONS}
        min={0}
        max={21}
        step={1}
        unit="meals / week"
      />

      <QuantityQuestion
        question="How often do you eat vegan meals?"
        helpText="No animal products at all."
        value={profile.food.veganMealsPerWeek}
        onChange={(v) => updateCategory("food", { veganMealsPerWeek: v })}
        quickOptions={FREQUENCY_OPTIONS}
        min={0}
        max={21}
        step={1}
        unit="meals / week"
      />
    </CalculatorShell>
  );
}
