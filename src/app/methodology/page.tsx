import type { Metadata } from "next";
import { emissionFactors } from "@/climate/factors";
import { categoryConfig } from "@/components/calculator/category-config";
import { Badge } from "@/components/ui/badge";
import { ASSUMED_ROUND_TRIP_KM } from "@/climate/calculations/flights";

export const metadata: Metadata = {
  title: "Methodology",
  description: "How the Climate Impact Visualizer calculates estimates, its data sources, and its limitations.",
};

const FACTOR_GROUPS = [
  { category: "transportation" as const, factors: emissionFactors.transportation },
  { category: "flights" as const, factors: emissionFactors.flights },
  { category: "home" as const, factors: emissionFactors.home },
  { category: "food" as const, factors: emissionFactors.food },
  { category: "shopping" as const, factors: emissionFactors.shopping },
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Methodology</h1>
      <p className="mt-3 text-muted-foreground">
        This calculator gives rough estimates, not a scientific carbon audit. This page explains
        how those estimates are calculated, where the numbers come from, and where they fall
        short.
      </p>

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-semibold">What is CO₂e?</h2>
        <p className="text-muted-foreground">
          CO₂e, or carbon dioxide equivalent, is a unit for expressing the combined warming effect
          of different greenhouse gases (carbon dioxide, methane, nitrous oxide, and others) as a
          single number, based on their relative warming potential. That lets emissions from very
          different activities, like driving, flying, and eating beef, get added together and
          compared on the same scale.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">How the calculation works</h2>
        <p className="text-muted-foreground">
          For each category, the app multiplies your reported activity (miles driven, kWh used,
          meals eaten, and so on) by a published emissions factor: the amount of CO₂e produced per
          unit of that activity. Category totals are added together for your overall footprint.
          All calculations are pure, deterministic functions, so the same inputs always produce
          the same output. None of it is calculated by AI or estimated qualitatively.
        </p>
        <p className="text-muted-foreground">
          The interface itself never performs a calculation. It calls into a separate calculation
          engine (<code>src/climate/calculations</code>) with its own test suite, which reads from
          local, versioned data files (<code>src/data/*.json</code>). Nothing is fetched from EPA,
          OWID, or DEFRA at runtime.
        </p>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Key assumptions</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>
            You report trips, not distances, so a domestic round trip is assumed to cover{" "}
            {ASSUMED_ROUND_TRIP_KM.domestic.toLocaleString()} km (about twice the average one-way
            US domestic flight) and an international round trip{" "}
            {ASSUMED_ROUND_TRIP_KM.international.toLocaleString()} km (a long-haul trip like
            US-Europe or US-Asia). Your actual trips may be shorter or longer.
          </li>
          <li>
            Beef and chicken per-meal figures assume a 150 g cooked serving, converted from
            published per-kilogram food footprints.
          </li>
          <li>
            Vegetarian and vegan meals use a different method: whole-diet daily averages from a UK
            dietary study, divided by an assumed 3 meals a day. No equivalent per-meal dataset was
            available for these.
          </li>
          <li>
            Electricity uses a single US national-average grid intensity for everyone, even though
            actual grid carbon intensity varies a lot by state and utility. State-level factors
            would be a good next addition, but they&apos;re not part of this MVP.
          </li>
          <li>
            SUV/truck and hybrid factors are derived approximations (see the factor table below),
            not numbers EPA publishes directly per mile.
          </li>
          <li>
            Clothing and electronics factors are rough, blended estimates. Per-item footprints vary
            enormously by product, and this MVP doesn&apos;t try to model that variation.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-xl font-semibold">Limitations</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
          <li>This is an MVP covering five everyday categories. It isn&apos;t an exhaustive inventory of every possible emissions source.</li>
          <li>Factors marked &ldquo;rough estimate&rdquo; below are placeholders, used where a precise, confidently sourced number wasn&apos;t available, rather than an invented number that just looks precise.</li>
          <li>Results are shown in rounded tonnes to avoid implying false precision. Internally, calculations use full decimal precision.</li>
          <li>Your data is estimated, self-reported, and never checked against any outside record.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Emission factors and sources</h2>
        <p className="mt-2 text-muted-foreground">
          Every number used anywhere in this app traces back to one of these factors.
        </p>
        <div className="mt-6 space-y-8">
          {FACTOR_GROUPS.map((group) => (
            <div key={group.category}>
              <h3 className="text-base font-semibold">{categoryConfig(group.category).title}</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th scope="col" className="py-2 pr-4 font-medium">Factor</th>
                      <th scope="col" className="py-2 pr-4 font-medium">Value</th>
                      <th scope="col" className="py-2 pr-4 font-medium">Source</th>
                      <th scope="col" className="py-2 font-medium">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.factors.map((factor) => (
                      <tr key={factor.id} className="border-b border-border/60 align-top">
                        <td className="py-2 pr-4">
                          <span className="font-medium">{factor.label}</span>
                          {factor.isPlaceholder && (
                            <Badge variant="secondary" className="ml-2 align-middle">
                              Rough estimate
                            </Badge>
                          )}
                          {factor.methodology && (
                            <p className="mt-1 max-w-md text-xs text-muted-foreground">{factor.methodology}</p>
                          )}
                        </td>
                        <td className="whitespace-nowrap py-2 pr-4 tabular-nums">
                          {factor.co2ePerUnit} kg / {factor.activityUnit}
                        </td>
                        <td className="py-2 pr-4">
                          <a
                            href={factor.source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-800 dark:text-emerald-400"
                          >
                            {factor.source.name}
                          </a>
                        </td>
                        <td className="whitespace-nowrap py-2 tabular-nums">{factor.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
