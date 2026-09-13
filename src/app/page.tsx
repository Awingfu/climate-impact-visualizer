import Link from "next/link";
import { ArrowRight, Car, Plane, Home as HomeIcon, Utensils, Shirt, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { icon: Car, label: "Transportation" },
  { icon: Plane, label: "Flights" },
  { icon: HomeIcon, label: "Home energy" },
  { icon: Utensils, label: "Food" },
  { icon: Shirt, label: "Shopping" },
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <span className="mx-auto mb-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Every number traced to a public source
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          See how your everyday choices affect the climate.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground text-balance">
          Estimate your personal greenhouse-gas footprint in a few minutes, see which choices
          drive it, and explore what happens if you change them.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="h-11 px-6 text-base">
            <Link href="/calculator">
              Calculate my impact <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="h-11 px-6 text-base">
            <Link href="/methodology">How this works</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-5">
          {CATEGORIES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">1. Answer a few questions</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Quick choices or exact numbers, whichever you know. No account needed.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">2. See your breakdown</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your estimated annual footprint, broken down by category, with sources for every number.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">3. Explore &quot;what if&quot;</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Change a choice and instantly see the impact, plus your biggest opportunities to reduce it.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
