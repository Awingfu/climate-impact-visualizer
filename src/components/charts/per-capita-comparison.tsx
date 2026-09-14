import { formatTonnes, kgToTonnes } from "@/lib/format";

type ComparisonRow = {
  label: string;
  tonnes: number;
  emphasis?: boolean;
};

type PerCapitaComparisonProps = {
  yourKgCo2ePerYear: number;
  countryLabel: string;
  countryTonnesPerYear: number;
  worldTonnesPerYear: number;
  /** True when the selected country benchmark is the same as the world one (e.g. "Other" was picked). */
  countryIsWorld: boolean;
};

export function PerCapitaComparison({
  yourKgCo2ePerYear,
  countryLabel,
  countryTonnesPerYear,
  worldTonnesPerYear,
  countryIsWorld,
}: PerCapitaComparisonProps) {
  const rows: ComparisonRow[] = [
    { label: "You", tonnes: kgToTonnes(yourKgCo2ePerYear), emphasis: true },
    ...(countryIsWorld ? [] : [{ label: `${countryLabel} average`, tonnes: countryTonnesPerYear }]),
    { label: "World average", tonnes: worldTonnesPerYear },
  ];

  const max = Math.max(...rows.map((r) => r.tonnes), 0.001);

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-3">
          <span className="w-32 shrink-0 text-sm text-muted-foreground sm:w-36">{row.label}</span>
          <div className="h-6 min-w-0 flex-1">
            <div
              className={`h-full rounded-[4px] ${row.emphasis ? "bg-emerald-600" : "bg-muted-foreground/30"}`}
              style={{ width: `${Math.max((row.tonnes / max) * 100, 3)}%` }}
            />
          </div>
          <span className="w-16 shrink-0 text-right text-sm font-medium tabular-nums">
            {formatTonnes(row.tonnes * 1000, row.tonnes < 10 ? 1 : 0)} t
          </span>
        </div>
      ))}
    </div>
  );
}
