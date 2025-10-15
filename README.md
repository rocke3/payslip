# Payslip Generator

An interactive, in-browser payslip generator built with Nuxt and Vue. It provides a clean, printable layout where every field is inline-editable, color theme is adjustable, and totals are calculated automatically.

## Features

- **Inline Editing**: Click any text or number to edit in place via `app/components/Editable.vue`.
- **Earnings Table**: Add/remove earning rows, with automatic total computation.
- **Theming Controls**: Live primary/secondary/border color pickers and a Settings panel.
- **Print-Ready**: Optimized print stylesheet and one-click print button.
- **Tooltips & UX**: Helpful tooltips and keyboard shortcut to toggle settings.
- **Zero backend**: All data is client-side; perfect for quick exports and demos.

## Tech Stack

- **Nuxt** (v4) with Vue 3
- **@nuxt/ui** for ready-to-use UI components
- **TypeScript**

See `package.json` for exact versions.

## Project Structure

- `app/pages/index.vue`: Main payslip UI (form, table, theme controls, print logic)
- `app/components/Editable.vue`: Content-editable component with number parsing/formatting
- `app/components/Tooltip.vue`: Wrapper over `UTooltip` for consistent tooltips
- `nuxt.config.ts`: Nuxt configuration (modules, global CSS, app head)
- `assets/css/main.css`: Global styles (referenced by Nuxt config)

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- pnpm, npm, or yarn

### Install

```bash
# with pnpm
pnpm install

# or npm
npm install

# or yarn
yarn
```

### Development

```bash
# start dev server
pnpm dev
# or
npm run dev
# or
yarn dev
```

The dev server URL will be printed in the terminal (typically http://localhost:3000).

### Production

```bash
# build for production
pnpm build
# preview the production build locally
pnpm preview

# optional: generate a static site (dist/)
pnpm generate
```

Equivalent `npm run`/`yarn` scripts are defined in `package.json`.

## Usage

1. Open the app in the browser.
2. Click on any field (company, dates, employee, bank, notes, table cells) to edit. Changes apply on blur.
3. Use the floating color pickers or the Settings panel to adjust colors.
4. Add new earning rows with “Add Earning Row”; remove with the trash icon.
5. Click the printer button to print/export as PDF.

### Keyboard Shortcuts

- **o**: Toggle the Settings panel.

## Customization

- Edit initial data in `app/pages/index.vue` (company details, labels, table headers, defaults).
- Update UI text by editing the corresponding `Editable` bindings.
- Adjust global styles in `assets/css/main.css` and component-scoped styles in `index.vue`.
- Theme via CSS variables bound in `index.vue`: `--theme-primary`, `--theme-secondary`, `--theme-border`.

## Printing and Export

- The layout uses a print stylesheet to hide interactive controls (`.no-print`) and optimize margins.
- Use your browser’s “Save as PDF” from the print dialog for digital copies.

## Scripts

- `dev`: Start Nuxt dev server
- `build`: Build for production
- `generate`: Generate static site to `dist/`
- `preview`: Preview production build
- `postinstall`: Nuxt prepare

## Deployment

You can deploy with any static host or Node host:

- **Static (recommended)**: `pnpm generate` then upload `dist/` to Netlify, Vercel (static), GitHub Pages, etc.
- **Node runtime**: Use `pnpm build` and run with a Node adapter or your hosting provider’s Nuxt support.

For Netlify/Vercel:

- Build command: `pnpm generate`
- Publish directory: `dist`

## Notes on Data & Privacy

- No server is used; data lives in the page while it’s open. Printing/export creates your local PDF.
- If you need persistence, integrate localStorage or a backend API to save/load templates.

## Roadmap Ideas

- Deductions and tax sections with summaries
- Multi-currency and locale-aware formatting
- Template presets and export/import of JSON
- Logo upload and image cropping

## Troubleshooting

- If UI components are missing styles, ensure dependencies are installed and the dev server restarted.
- Validate that `nuxt.config.ts` lists modules and global CSS as expected.

## License

Specify your preferred license (e.g., MIT) in this section.
