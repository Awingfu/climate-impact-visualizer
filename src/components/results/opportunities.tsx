"use client";

import { Car, Plane, Beef, Zap, Shirt, ArrowRight } from "lucide-react";
import type { ClimateProfile, Opportunity } from "@/climate/types";
import { calculateTotalFootprint } from "@/climate";
import { formatTonnes } from "@/lib/format";

const ICONS = { car: Car, plane: Plane, beef: Beef, zap: Zap, shirt: Shirt };

type OpportunitiesProps = {
  profile: ClimateProfile;
  opportunities: Opportunity[];
};

/**
 * Doubles as the "what if?" feature: each opportunity already shows the
 * baseline -> scenario comparison, not just the label and reduction.
 */
export function Opportunities({ profile, opportunities }: OpportunitiesProps) {
  const baselineTonnes = calculateTotalFootprint(profile).totalKgCo2ePerYear / 1000;

  if (opportunities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Once you&apos;ve entered some activity, we&apos;ll surface your biggest opportunities to reduce it here.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {opportunities.map((opp, index) => {
        const Icon = ICONS[opp.icon as keyof typeof ICONS] ?? Car;
        const scenarioTonnes = baselineTonnes - opp.reductionKgCo2ePerYear / 1000;
        return (
          <li key={opp.id} className="rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                  <p className="font-medium">{opp.label}</p>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{opp.description}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <span className="tabular-nums text-muted-foreground">{formatTonnes(baselineTonnes * 1000)} t</span>
                  <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  <span className="tabular-nums font-medium">{formatTonnes(scenarioTonnes * 1000)} t</span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">
                    (-{formatTonnes(opp.reductionKgCo2ePerYear)} t/yr)
                  </span>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
