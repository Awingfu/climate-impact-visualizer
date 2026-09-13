"use client";

import { useProfile } from "@/components/profile-provider";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { QuantityQuestion } from "@/components/calculator/quantity-question";
import { calculateFlights, emissionFactors } from "@/climate";

export default function FlightsCalculatorPage() {
  const { profile, updateCategory } = useProfile();
  const result = calculateFlights(profile.flights, emissionFactors);

  return (
    <CalculatorShell
      path="/calculator/flights"
      subtitle="Flying is one of the most carbon-intensive things an individual can do. We use average trip distances so you don't have to look up flight mileage."
      categoryKgCo2ePerYear={result.kgCo2ePerYear}
    >
      <QuantityQuestion
        question="How many domestic round trips do you fly per year?"
        helpText="Round trips within your home country."
        value={profile.flights.domesticTripsPerYear}
        onChange={(v) => updateCategory("flights", { domesticTripsPerYear: v })}
        quickOptions={[
          { label: "None", value: 0 },
          { label: "1-2", value: 1 },
          { label: "3-5", value: 4 },
          { label: "6+", value: 8 },
        ]}
        min={0}
        max={20}
        step={1}
        unit="trips / year"
        formatValue={(v) => `${Math.round(v)} trip${Math.round(v) === 1 ? "" : "s"} / year`}
      />

      <QuantityQuestion
        question="How many international round trips do you fly per year?"
        helpText="Includes at least one long-haul leg."
        value={profile.flights.internationalTripsPerYear}
        onChange={(v) => updateCategory("flights", { internationalTripsPerYear: v })}
        quickOptions={[
          { label: "None", value: 0 },
          { label: "1", value: 1 },
          { label: "2-3", value: 2 },
          { label: "4+", value: 5 },
        ]}
        min={0}
        max={15}
        step={1}
        unit="trips / year"
        formatValue={(v) => `${Math.round(v)} trip${Math.round(v) === 1 ? "" : "s"} / year`}
      />
    </CalculatorShell>
  );
}
