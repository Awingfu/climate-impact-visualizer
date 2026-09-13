"use client";

import { useProfile } from "@/components/profile-provider";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { QuantityQuestion } from "@/components/calculator/quantity-question";
import { calculateHome, emissionFactors } from "@/climate";

export default function HomeCalculatorPage() {
  const { profile, updateCategory } = useProfile();
  const result = calculateHome(profile.home, emissionFactors);

  return (
    <CalculatorShell
      path="/calculator/home"
      subtitle="We use a US national-average grid emissions factor here. Actual intensity varies a lot by state; see the methodology page for details."
      categoryKgCo2ePerYear={result.kgCo2ePerYear}
    >
      <QuantityQuestion
        question="How much electricity do you use?"
        helpText="Check a recent utility bill if you have one handy, or just estimate."
        value={profile.home.electricityKwhPerMonth}
        onChange={(v) => updateCategory("home", { electricityKwhPerMonth: v })}
        quickOptions={[
          { label: "Small / efficient home", value: 400 },
          { label: "Average home", value: 900 },
          { label: "Large home", value: 1500 },
          { label: "Not sure", value: 900 },
        ]}
        min={0}
        max={3000}
        step={50}
        unit="kWh / month"
      />

      <QuantityQuestion
        question="How much natural gas do you use?"
        helpText="For heating, hot water, or cooking. Skip this if you don't use natural gas."
        value={profile.home.naturalGasThermsPerMonth ?? 0}
        onChange={(v) => updateCategory("home", { naturalGasThermsPerMonth: v })}
        quickOptions={[
          { label: "None / electric only", value: 0 },
          { label: "Light use", value: 20 },
          { label: "Average use", value: 40 },
          { label: "Heavy use", value: 80 },
        ]}
        min={0}
        max={200}
        step={5}
        unit="therms / month"
      />
    </CalculatorShell>
  );
}
