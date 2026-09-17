# Purpose
Educational mathematics website about numerical solutions of differential equations.
User-facing content and the README are in German.

# Stack
Astro, TypeScript, React islands, Plotly.js, KaTeX, Vitest, npm and GitHub Pages.
Entirely static: no backend, authentication, database or server runtime.

# Architecture rules
- Mathematical algorithms belong in `src/math/`, never in React components.
- React is only for interactive UI; static pages and layouts use Astro.
- Keep components small and focused. Do not create large monolithic files.
- Prefer reusable pure TypeScript functions.
- Separate equation definitions, solvers, exact solutions, simulation data,
  visualization and UI. Data orchestration is in `src/simulation/`;
  Plotly trace construction is in `src/visualization/`.
- Use `sitePath` for internal links and public assets so repository subpaths work.
- Preserve useful existing files. Do not commit generated builds or dependencies.

# Mathematical correctness
Never silently alter algorithms to simplify UI implementation. For numerical changes,
preserve mathematical correctness, add or update tests, and document assumptions.
Euler-Cromer and leapfrog require q'' = a(t,q), independent of velocity.
Leapfrog uses kick-drift-kick with synchronized output velocities.
Mechanical solution states contain all positions followed by all velocities.

# Completion checks
Before completing changes run:
```bash
npm run check
npm test
npm run build
```
Fix failures caused by changes. Track `package-lock.json`; use `npm ci` in CI.
