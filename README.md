# Terranova Gear Co. — Product Detail Page

A production-grade PDP for a premium outdoor gear store. Built with React 18, Vite, and SCSS modules.

## Setup

```bash
# Requires Node 18+
git clone <repo>
cd outdoor-gear-pdp
npm install
npm run dev
```

Open http://localhost:5173

```bash
npm run build   # production build
npm run preview # preview locally
```

## Stack

- React 18 with hooks
- Vite
- SCSS modules (no Tailwind, no CSS-in-JS)
- React Router v6 (for URL-synced variant state)
- Context API + useReducer for cart state
- localStorage for persistence

## Features

- Product data from fakestoreapi.com, supplemented with static config
- Colour swatches + size buttons with sold-out / low-stock states
- Cart persisted to localStorage and rehydrated on page load
- Deep-linkable variants via URL params (?color=forest&size=l)
- Gallery with hover-zoom on desktop, horizontal scroll + dots on mobile
- Mock add-to-cart API with ~20% simulated failure rate
- Accordion for description / specs / reviews below fold
- Cart drawer (slide-in, Escape-closeable, scroll-locked)

## Known trade-offs

- Stock is global per size, not per colour/size combo (Fake Store API limitation)
- No full routing — single PDP page
- Reviews are static

See DECISIONS.md for architectural notes.
