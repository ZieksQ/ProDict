# ProDict Client - AI Coding Instructions

## Project Overview

This is the **ProDict Client** — a React 19 + TypeScript frontend built with Vite 7. It's part of the larger ProDict application (likely paired with a backend service in the parent `ProDict/src/` directory).

## Tech Stack

- **React 19** with functional components and hooks
- **TypeScript 5.9** with strict mode enabled
- **Vite 7** for bundling and dev server
- **ESLint 9** with flat config format

## Development Commands

```bash
npm run dev      # Start dev server with HMR
npm run build    # Type-check (tsc -b) then build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Project Structure

```
src/
├── main.tsx         # App entry point, renders into #root with StrictMode
├── App.tsx          # Root component with routing
├── App.css          # App-level styles
├── index.css        # Global styles (CSS variables, resets)
├── components/      # Reusable UI components (buttons, forms, modals, etc.)
├── pages/           # Page-level components (one per route)
└── assets/          # Static assets (SVGs, images)
```

### Component Organization
- **`components/`** — Reusable UI components that can be used across multiple pages
- **`pages/`** — Page-level components that correspond to routes; compose reusable components

## Code Conventions

### TypeScript
- Strict mode is enabled — do not use `any` without justification
- Use `.tsx` extension for files containing JSX
- Import with `.tsx` extension allowed (`allowImportingTsExtensions: true`)

### React Patterns
- Use functional components exclusively (no class components)
- Use `useState`, `useEffect`, and other hooks for state/lifecycle
- Wrap app in `<StrictMode>` (see [main.tsx](src/main.tsx))
- Use fragments (`<>...</>`) to avoid unnecessary wrapper divs
- **Lazy load pages** using `React.lazy()` and `<Suspense>` for code splitting and better performance
  ```tsx
  const HomePage = lazy(() => import('./pages/HomePage'))
  ```

### Styling
- CSS variables defined in `:root` in [index.css](src/index.css)
- Component styles in co-located `.css` files (e.g., `App.css` for `App.tsx`)
- Supports `prefers-color-scheme` for light/dark mode
- Supports `prefers-reduced-motion` for accessibility

### ESLint
- Flat config format in [eslint.config.js](eslint.config.js)
- React Hooks rules and React Refresh rules are enforced
- `dist/` folder is ignored

## Adding New Features

### Creating Components
1. **Reusable components** go in `src/components/` (e.g., `Button.tsx`, `Modal.tsx`)
2. **Page components** go in `src/pages/` (e.g., `HomePage.tsx`, `AboutPage.tsx`)
3. Co-locate component-specific CSS files in the same directory
4. Use default exports for page components (for lazy loading compatibility)
5. Use named exports for reusable components

## Build Notes

- Production builds output to `dist/` (gitignored)
- TypeScript compilation runs before Vite build (`tsc -b && vite build`)
- Target is ES2022 for modern browser support

## Fetch Rules

- Create a `fetcher.js` a reusable fetch function
- Make a `.service.js` for every fetch function you will make
- Make `Service` folder for this