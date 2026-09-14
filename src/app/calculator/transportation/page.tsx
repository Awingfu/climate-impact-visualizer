"use client";

import { useProfile } from "@/components/profile-provider";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { QuantityQuestion } from "@/components/calculator/quantity-question";
import { ChoiceQuestion } from "@/components/calculator/choice-question";
import { calculateTransportation, emissionFactors } from "@/climate";

export default function TransportationCalculatorPage() {
  const { profile, updateCategory } = useProfile();
  const result = calculateTransportation(profile.transportation, emissionFactors, profile.home);

  return (
    <CalculatorShell
      path="/calculator/transportation"
      subtitle="Driving is usually the single biggest source of personal emissions in the US. A rough estimate is fine."
      categoryKgCo2ePerYear={result.kgCo2ePerYear}
    >
      <QuantityQuestion
        question="How much do you drive?"
        helpText="Personal driving, not commercial or work travel."
        value={profile.transportation.carMilesPerMonth}
        onChange={(v) => updateCategory("transportation", { carMilesPerMonth: v })}
        quickOptions={[
          { label: "Almost never", value: 50 },
          { label: "Occasionally", value: 300 },
          { label: "Most days", value: 800 },
          { label: "Every day", value: 1200 },
        ]}
        min={0}
        max={3000}
        step={50}
        unit="miles / month"
      />

      <ChoiceQuestion
        question="What do you mostly drive?"
        value={profile.transportation.vehicleType}
        onChange={(v) => updateCategory("transportation", { vehicleType: v })}
        choices={[
          { value: "car", label: "Car / sedan", description: "Compact, sedan, or similar" },
          { value: "suv_truck", label: "SUV or truck", description: "Larger, less fuel efficient on average" },
        ]}
      />

      <ChoiceQuestion
        question="What fuel does it use?"
        value={profile.transportation.fuelType}
        onChange={(v) => updateCategory("transportation", { fuelType: v })}
        choices={[
          { value: "gasoline", label: "Gasoline", description: "Most common in the US" },
          { value: "hybrid", label: "Hybrid", description: "Better fuel economy than gasoline-only" },
          { value: "electric", label: "Electric", description: "Emissions depend on the electric grid" },
        ]}
      />

      <QuantityQuestion
        question="How much do you use public transit?"
        helpText="Bus, subway, or commuter rail."
        value={profile.transportation.publicTransitMilesPerMonth}
        onChange={(v) => updateCategory("transportation", { publicTransitMilesPerMonth: v })}
        quickOptions={[
          { label: "Never", value: 0 },
          { label: "Sometimes", value: 50 },
          { label: "Regularly", value: 300 },
          { label: "Daily commute", value: 600 },
        ]}
        min={0}
        max={1200}
        step={25}
        unit="miles / month"
      />
    </CalculatorShell>
  );
}
