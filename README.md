# TaskFlow — Smart Project Management Dashboard

TaskFlow is a 15-day frontend development internship project for Code A Nova. It is a polished project-management workspace with a dashboard overview, live-feeling activity feed, interactive charts, a responsive Kanban board, task detail editing, filters, keyboard shortcuts, and persistent local state.

## Internship information

| Field | Details |
| --- | --- |
| Student | Mohd Adil |
| College | Jamia Hamdard University |
| Internship duration | 2 months |
| Mentor / company | None specified |
| GitHub profile | [@imaadilshaikh](https://github.com/imaadilshaikh) |

This TaskFlow dashboard is the frontend project deliverable completed during the internship. The source brief contains a focused 15-day milestone plan within the overall 2-month internship period.

## Live demo

The deployed TaskFlow application is available at [taskflow-by-adil.netlify.app/dashboard](https://taskflow-by-adil.netlify.app/dashboard).

## Run locally

```bash
npm install
npm run dev
```

The development server listens on `http://localhost:3000`. Production output is generated with `npm run build`; focused tests run with `npm run test`.

## Feature overview

The dashboard makes project health visible through four metrics, a completion donut, a weekly momentum line chart, a delivery-mix bar chart, project progress rows, and recent activity. The Board route provides four accessible Kanban columns (To do, In progress, Review, Done) with drag handles, cross-column movement, task cards, filters, sorting, global search, and mobile horizontal scrolling. Selecting a task opens a focused detail modal where title, description, status, priority, assignee, due date, tags, and subtasks can be updated. New tasks can be created from the global CTA or the `N` shortcut.

Theme preference, task changes, and filters persist through local storage. The interface supports dark, light, and system themes, semantic status labels, visible focus states, reduced-motion behavior, responsive layouts, a mobile navigation drawer, and touch-friendly controls. The mock data/repository boundary is intentionally shaped for a future backend integration, but the internship brief keeps this delivery backend-free.

## Technology choices

The visual system uses a premium espresso direction built from the provided palette: `--pri: #FCDEC0`, `--sec: #7D5A50`, `--tri1: #E5B299`, and `--tri2: #B4846C`. These colors are used with layered dark surfaces, cream typography, restrained tan accents, and subtle shadows rather than as flat full-page fills.

- React 18 + TypeScript + Vite
- CSS variables and custom CSS for the visual system, with reusable UI patterns
- Zustand with persistence for workspace state
- Recharts for dashboard data visualization
- dnd-kit for keyboard-friendly drag-and-drop
- React Router v6 for page routes
- Vitest for focused utility tests
- Lucide icons for consistent interface affordances

## Project structure

`src/App.tsx` contains the route-aware shell and page-level composition. `src/data/mockData.ts` is the typed seed dataset, `src/store/useTaskStore.ts` owns local state and persistence, `src/lib/utils.ts` holds shared formatting/filtering helpers, and `src/styles.css` defines the warm brown-and-cream operations-console design system. `public/manus-routes.json` declares the supported page routes for managed preview.

## Internship submission notes

The project is intentionally static and demo-ready: no paid APIs, backend service, authentication, or database is needed. To present it, open Dashboard first, move to Board to show filters and drag-and-drop, click a task to edit its detail, switch the theme under Settings, then refresh to demonstrate local persistence.
