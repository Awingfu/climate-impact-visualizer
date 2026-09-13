"use client";

import { useProfile } from "@/components/profile-provider";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { QuantityQuestion } from "@/components/calculator/quantity-question";
import { calculateShopping, emissionFactors } from "@/climate";

export default function ShoppingCalculatorPage() {
  const { profile, updateCategory } = useProfile();
  const result = calculateShopping(profile.shopping, emissionFactors);

  return (
    <CalculatorShell
      path="/calculator/shopping"
      subtitle="Shopping is the roughest estimate in this calculator. Manufacturing footprints vary enormously by product, so treat these numbers as order-of-magnitude only."
      categoryKgCo2ePerYear={result.kgCo2ePerYear}
    >
      <QuantityQuestion
        question="How many new clothing items do you buy?"
        helpText="New, not secondhand."
        value={profile.shopping.clothingItemsPerMonth}
        onChange={(v) => updateCategory("shopping", { clothingItemsPerMonth: v })}
        quickOptions={[
          { label: "Rarely", value: 0.5 },
          { label: "A few / month", value: 2 },
          { label: "Regularly", value: 5 },
          { label: "Frequently", value: 10 },
        ]}
        min={0}
        max={20}
        step={0.5}
        unit="items / month"
      />

      <QuantityQuestion
        question="How many electronics do you buy per year?"
        helpText="Phones, laptops, tablets, and similar devices."
        value={profile.shopping.electronicsPerYear}
        onChange={(v) => updateCategory("shopping", { electronicsPerYear: v })}
        quickOptions={[
          { label: "None", value: 0 },
          { label: "1", value: 1 },
          { label: "2-3", value: 2 },
          { label: "4+", value: 4 },
        ]}
        min={0}
        max={10}
        step={1}
        unit="items / year"
        formatValue={(v) => `${Math.round(v)} item${Math.round(v) === 1 ? "" : "s"} / year`}
      />
    </CalculatorShell>
  );
}
