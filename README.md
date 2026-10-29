# Cynbit Project Planner (prototype)

A Cynbit-style site built with **React 18, Vite and Ant Design 5**, with one added feature: the **Project Planner**.
A visitor describes their problem in plain language and gets a recommended Cynbit service or product, a project size,
an indicative timeline and a suggested stack. They can then send the plan as a lead. A demo **Leads** view
(`/#/admin`) lists, exports (CSV) and clears the captured leads.

Not the official Cynbit website; content is paraphrased from cynbit.in.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Deploy
Import the repo into Vercel or Netlify. Build command `npm run build`, output directory `dist`. No environment variables needed.

## Structure
- `src/App.jsx`: page layout, hash routing (`#/` and `#/admin`), services and products sections
- `src/ProjectScoper.jsx`: the 3-step planner (Ant Design Form, Steps, Descriptions)
- `src/scoper.js`: keyword detection, plan estimation rules, lead storage helpers
- `src/LeadsAdmin.jsx`: leads table, stats, CSV export

## Known limits
Leads are saved in the browser's localStorage, so they are not shared between visitors. Estimates are heuristics, not quotes.
Next step: replace `saveLead` and `getLeads` with calls to an API backed by Postgres (for example Supabase).
