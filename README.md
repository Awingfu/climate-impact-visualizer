# Climate Impact Visualizer

An interactive climate-impact explorer: estimate your personal annual greenhouse-gas
footprint from everyday choices (transportation, flights, home energy, food, and
shopping), see it broken down by category, and explore "what if" scenarios. Every
number is traceable back to a public emissions data source.

This is an MVP: no accounts, no backend, no database. Your answers live only in your
browser (`localStorage`), and the whole app is a static site.

**Live app:** https://awingfu.github.io/climate-impact-visualizer/

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · shadcn/ui · Recharts · Zod · Vitest

## Architecture

```
UI  ->  Calculator/domain logic  ->  Emission-factor data
```

- `src/data/*.json`: sourced emission factors (EPA, DEFRA, OWID, and peer-reviewed
  studies), each with provenance (source name, URL, year, methodology notes).
- `src/climate/`: a pure, dependency-free TypeScript calculation engine. No React,
  no runtime network requests. Fully unit tested (`*.test.ts` alongside each module).
- `src/components/` and `src/app/`: the UI, which only ever calls into the
  calculation engine and never computes emissions itself.

See `/methodology` in the running app for the full list of data sources and
assumptions.

## Getting started

```bash
npm install
npm run dev       # start the dev server at http://localhost:3000
npm test          # run the calculation-engine test suite
npm run build     # production build (static export to ./out)
```

## Project structure

```
src/
├── app/                  # routes (home, calculator/*, results, methodology, about)
├── components/
│   ├── calculator/       # reusable question components
│   ├── charts/           # Recharts visualizations
│   ├── layout/           # header/footer
│   └── ui/               # shadcn/ui primitives
├── climate/
│   ├── types.ts          # ClimateProfile, EmissionFactor, EmissionResult, ...
│   ├── factors.ts        # loads & normalizes src/data/*.json
│   ├── calculations/     # one pure function per category, plus tests
│   └── index.ts          # calculateTotalFootprint, calculateScenario, opportunities
├── data/                 # sourced emission factors (JSON)
└── lib/                  # formatting + localStorage helpers
```

## Deployment

The app builds to a static export (`next.config.ts` sets `output: "export"`) and
deploys to GitHub Pages from the `gh-pages` branch.

- `.github/workflows/gh-pages.deploy.yml` builds and deploys on every push to
  `main`, publishing `./out` to `gh-pages`.
- `.github/workflows/preview.yml` builds a preview for each pull request under
  `pr-preview/pr-<number>`, and removes it when the PR closes.

Both workflows set `NEXT_PUBLIC_BASE_PATH` so asset and route URLs resolve correctly
under the `/climate-impact-visualizer/` subpath GitHub Pages serves the site from.

One-time repo setup, if Pages isn't already enabled: in **Settings > Pages**, set
the source to the `gh-pages` branch (root). The first push to `main` after that
creates the branch and publishes the site.

To build the static export locally with the same base path CI uses:

```bash
NEXT_PUBLIC_BASE_PATH=/climate-impact-visualizer npm run build
npx serve out
```
