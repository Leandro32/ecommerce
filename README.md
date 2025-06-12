# 🚀 React + Vite + Tailwind

Lightweight starter for any modern SPA—no CRA bloat, zero config gymnastics.

## Stack
• Vite 5 (HMR, lightning build)  
• React 18 (hooks, suspense)  
• Tailwind CSS 3 (JIT, dark-mode)  
• PostCSS (autoprefixer already wired)  
• ESLint + Prettier (airbnb-ish)  

## Quick Start
```bash
git clone <repo> my-app && cd $_
yarn        # install deps
yarn dev    # local dev @ http://localhost:5173
```

## Scripts
- `yarn dev` – start dev server with HMR
- `yarn build` – production build to `/dist`
- `yarn preview` – serve `/dist` locally
- `yarn lint` – eslint + prettier
- `yarn format` – prettier write
- `yarn test` – vitest (stub, enable when you add tests)

## Environment Vars
Create `.env` (auto-loaded by Vite):
```
VITE_API_URL=https://api.example.com
```

## Project Layout
```
src/
 ├─ assets/        # static imports
 ├─ components/    # shared UI
 ├─ hooks/         # custom hooks
 ├─ pages/         # routable views (react-router optional)
 ├─ styles/        # tailwind’s @layer stuff
 └─ main.tsx       # app entry
tailwind.config.js
postcss.config.js
vite.config.ts
```

## Tailwind Tips
1. Add global styles in `src/styles/index.css`.  
2. Use `@apply` sparingly; prefer composition.  
3. Enable dark mode by toggling `class="dark"` on `<html>`.

## Deployment
`dist/` is plain static—drop it on Netlify, Vercel, S3, Cloudflare Pages, nginx, whatever.

## License
MIT — do whatever, no warranties.

