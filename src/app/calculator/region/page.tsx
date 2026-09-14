"use client";

import { useProfile } from "@/components/profile-provider";
import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { ELECTRICITY_REGIONS, US_STATES } from "@/climate";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegionCalculatorPage() {
  const { profile, updateCategory } = useProfile();
  const countryCode = profile.home.countryCode ?? "US";

  return (
    <CalculatorShell
      path="/calculator/region"
      subtitle="We'll use this to pick a realistic electricity grid factor for your area — it affects the home energy and electric-vehicle estimates later. Everything else still uses general averages."
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-medium">Where do you live?</h3>
        </div>
        <div className="max-w-xs">
          <Label htmlFor="region-country" className="sr-only">
            Country
          </Label>
          <Select
            value={countryCode}
            onValueChange={(v) => updateCategory("home", { countryCode: v, usStateCode: undefined })}
          >
            <SelectTrigger id="region-country" className="w-full">
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

      {countryCode === "US" && (
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-medium">Which state?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              US grid carbon intensity varies a lot by state. Skip this if you want the US average.
            </p>
          </div>
          <div className="max-w-xs">
            <Label htmlFor="region-state" className="sr-only">
              State
            </Label>
            <Select
              value={profile.home.usStateCode ?? "unset"}
              onValueChange={(v) => updateCategory("home", { usStateCode: v === "unset" ? undefined : v })}
            >
              <SelectTrigger id="region-state" className="w-full">
                <SelectValue placeholder="US average" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unset">US average</SelectItem>
                {US_STATES.map((state) => (
                  <SelectItem key={state.code} value={state.code}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
