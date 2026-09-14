type EnergyMixBarProps = {
  mixPercent: { fossil: number; nuclear: number; renewables: number; other: number };
};

const SEGMENTS = [
  { key: "renewables" as const, label: "Renewables", color: "#059669" },
  { key: "nuclear" as const, label: "Nuclear", color: "#7c6fd1" },
  { key: "fossil" as const, label: "Fossil fuels", color: "#c2620f" },
  { key: "other" as const, label: "Other / unknown", color: "#94a3b8" },
];

export function EnergyMixBar({ mixPercent }: EnergyMixBarProps) {
  const segments = SEGMENTS.map((s) => ({ ...s, value: mixPercent[s.key] })).filter((s) => s.value > 0);

  return (
    <div>
      <div className="flex h-8 w-full gap-0.5 overflow-hidden rounded-[4px]" role="img" aria-label={segments.map((s) => `${s.label} ${s.value.toFixed(0)}%`).join(", ")}>
        {segments.map((s) => (
          <div
            key={s.key}
            className="flex h-full items-center justify-center"
            style={{ width: `${s.value}%`, backgroundColor: s.color }}
          >
            {s.value >= 10 && (
              <span className="text-xs font-medium text-white">{Math.round(s.value)}%</span>
            )}
          </div>
        ))}
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-1.5">
            <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
            {s.label}: {s.value.toFixed(0)}%
          </li>
        ))}
      </ul>
    </div>
  );
}
