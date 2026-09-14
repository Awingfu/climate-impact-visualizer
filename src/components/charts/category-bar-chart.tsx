"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { EmissionResult } from "@/climate/types";
import { categoryConfig } from "@/components/calculator/category-config";
import { formatTonnes, kgToTonnes } from "@/lib/format";

type CategoryBarChartProps = {
  categories: EmissionResult[];
  totalKgCo2ePerYear: number;
};

type ChartRow = {
  label: string;
  tonnes: number;
  kg: number;
  percent: number;
  color: string;
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: ChartRow }[] }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-popover-foreground">{row.label}</p>
      <p className="text-muted-foreground">
        {formatTonnes(row.kg)} t CO₂e/yr · {row.percent.toFixed(0)}% of total
      </p>
    </div>
  );
}

export function CategoryBarChart({ categories, totalKgCo2ePerYear }: CategoryBarChartProps) {
  const data: ChartRow[] = categories.map((c) => {
    const config = categoryConfig(c.category);
    return {
      label: config.title,
      tonnes: Number(kgToTonnes(c.kgCo2ePerYear).toFixed(2)),
      kg: c.kgCo2ePerYear,
      percent: totalKgCo2ePerYear > 0 ? (c.kgCo2ePerYear / totalKgCo2ePerYear) * 100 : 0,
      color: config.color,
    };
  });

  return (
    <div>
      <div className="h-64 w-full sm:h-72" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 4 }}>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="label"
              width={110}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 13 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="tonnes" radius={[0, 4, 4, 0]} barSize={28} isAnimationActive={false}>
              {data.map((row) => (
                <Cell key={row.label} fill={row.color} />
              ))}
              <LabelList
                dataKey="tonnes"
                position="right"
                formatter={(value) => `${Number(value).toFixed(1)} t`}
                style={{ fill: "var(--foreground)", fontSize: 13, fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/*
        Accessible data table alternative to the chart above, for screen readers and non-visual access.
        The label lives in a sr-only heading rather than a <caption>: browsers force table-caption
        boxes to position:static, so a sr-only <caption> renders visibly instead of being clipped,
        overlapping content below the chart.
      */}
      <h3 id="category-breakdown-table-heading" className="sr-only">
        Estimated annual CO₂e emissions by category
      </h3>
      <table className="sr-only" aria-labelledby="category-breakdown-table-heading">
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Tonnes CO₂e per year</th>
            <th scope="col">Share of total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{formatTonnes(row.kg)}</td>
              <td>{row.percent.toFixed(0)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
