"use client";

import { useProfile } from "@/components/profile-provider";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { QuantityQuestion } from "@/components/calculator/quantity-question";
import { calculateHome, emissionFactors, ELECTRICITY_REGIONS } from "@/climate";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HomeCalculatorPage() {
  const { profile, updateCategory } = useProfile();
  const result = calculateHome(profile.home, emissionFactors);

  return (
    <CalculatorShell
      path="/calculator/home"
      subtitle="Electricity grid carbon intensity varies a lot by country (and by state/region within a country). Pick where you live for a closer estimate; see the methodology page for details and sources."
      categoryKgCo2ePerYear={result.kgCo2ePerYear}
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-medium">Where do you live?</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Changes the electricity grid factor used below. Other categories still use general
            averages.
          </p>
        </div>
        <div className="max-w-xs">
          <Label htmlFor="home-country" className="sr-only">
            Country
          </Label>
          <Select
            value={profile.home.countryCode ?? "US"}
            onValueChange={(v) => updateCategory("home", { countryCode: v })}
          >
            <SelectTrigger id="home-country" className="w-full">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {ELECTRICITY_REGIONS.map((region) => (
                <SelectItem key={region.code} value={region.code}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
