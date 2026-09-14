"use client";

import Link from "next/link";
import { useProfile } from "@/components/profile-provider";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { QuantityQuestion } from "@/components/calculator/quantity-question";
import { calculateHome, emissionFactors, ELECTRICITY_REGIONS, usStateElectricity } from "@/climate";

export default function HomeCalculatorPage() {
  const { profile, updateCategory } = useProfile();
  const result = calculateHome(profile.home, emissionFactors);

  const countryCode = profile.home.countryCode ?? "US";
  const country = ELECTRICITY_REGIONS.find((r) => r.code === countryCode);
  const state = countryCode === "US" ? usStateElectricity(profile.home.usStateCode) : undefined;
  const regionLabel = state ? `${state.name}, United States` : (country?.label ?? "United States");

  return (
    <CalculatorShell
      path="/calculator/home"
      subtitle="Electricity grid carbon intensity varies a lot by location. We're using the electricity factor for the region you picked earlier."
      categoryKgCo2ePerYear={result.kgCo2ePerYear}
    >
      <p className="-mt-4 text-sm text-muted-foreground">
        Using electricity data for <span className="font-medium text-foreground">{regionLabel}</span>.{" "}
        <Link href="/calculator/region" className="underline underline-offset-2 hover:text-foreground">
          Change
        </Link>
      </p>

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
