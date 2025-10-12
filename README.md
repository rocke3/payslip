# Payslip Generator

A modern, professional, and fully editable payslip application built with Nuxt 4 and Vue 3. Edit inline fields, upload a company logo, change the theme color, manage earning rows, and export a high‑quality PDF.

> Project metadata: see `metadata.json` (name: "Interactive Professional Payslip").

## Features

- **Inline editing** for all text and numeric fields via `components/Editable.vue`.
- **Logo upload** with instant preview.
- **Theme color** picker powered by CSS variables for live theming.
- **Earnings table** with add/remove rows and auto‑calculated totals.
- **PDF export** with sizing options (Fit, A4, Letter) using html2canvas + jsPDF.
- **Responsive UI** styled with Tailwind CSS.

## Tech Stack

- **Framework:** Nuxt 4 (Vue 3)
- **Language:** TypeScript in Vue SFCs
- **Styling:** Tailwind CSS via `@nuxtjs/tailwindcss`
- **PDF/Canvas:** html2canvas + jsPDF (accessed via `window`)

## Project Structure

- `app.vue` — main payslip UI and logic (theme, PDF export, earnings, formatting).
- `components/Editable.vue` — reusable `contenteditable` component with number parsing and display formatting.
- `metadata.json` — app metadata (name, description).
- `package.json` — scripts and dependencies.
- `bun.lock` — lockfile (if using Bun).

## Scripts

Defined in `package.json`:

- `dev` — start local dev server
- `build` — production build
- `generate` — static site generation
- `preview` — preview production build
- `postinstall` — `nuxt prepare`

## Getting Started

**Prerequisites**

- Node.js 18+
- A package manager (npm, pnpm, yarn, or bun)

**Install**

```bash
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

**Run Dev Server**

```bash
npm run dev
# open the URL printed in the terminal (typically http://localhost:3000)
```

## Build & Deploy

**Production build**

```bash
npm run build
npm run preview # to locally preview the production build
```

**Static generation** (for static hosting)

```bash
npm run generate
```

For Nuxt 4, the generated static assets will be under `.output/public`. Deploy these to any static host (Netlify, Vercel static, GitHub Pages, S3 + CDN, etc.).

## Usage Guide

- **Edit fields:** Click any text to edit (company info, employee info, dates, notes, earnings).
- **Theme color:** Use the color picker in the top toolbar to change the primary theme.
- **Logo:** Click "Upload Logo" to add a company logo (shows inline preview).
- **Earnings:**
  - Click "Add Earning Row" to add a new row.
  - Use the trash icon to remove a row.
  - Number fields parse input and update totals automatically.
- **Pay period:** Edit `startDate` / `endDate` inline.
- **PDF export:** Click "Download PDF" to export the payslip.
  - The app calculates appropriate dimensions based on selected size (Fit, A4, Letter).

## Configuration Tips

- **Currency formatting:** Update `formatCurrency()` in `app.vue` to change locale/currency.
- **Default data:** Modify `initialPayslipData` in `app.vue` to change placeholders and defaults.
- **Tailwind:** Enabled via `@nuxtjs/tailwindcss`. Add Tailwind config as needed.
- **PDF libs:** Ensure `html2canvas` and `jspdf` are available on `window` in production (via CDN script tags or a Nuxt plugin).

## Troubleshooting

- If PDF download does nothing, verify `html2canvas` and `jspdf` are loaded and accessible on `window`.
- If styling differs in production, confirm Tailwind is configured and that required classes are not purged.

## License

MIT © Mamunur Rashid
