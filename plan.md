# TaskFlow — Internship Project Plan

## Product scope

TaskFlow is a responsive single-page project-management dashboard built from the Code A Nova 15-Day Frontend Development Internship Project Brief. It will demonstrate a production-ready frontend with a dashboard overview, interactive charts, a drag-and-drop Kanban board, task details, filtering/search, collaboration cues, theme switching, responsive layouts, accessibility, and local persistence using mock JSON data and local storage.

The first delivery will be a polished, demo-ready frontend. No backend server, database, paid API, authentication, or external service is required. The data layer will use typed mock data with a small repository abstraction so a future backend can replace local persistence without changing UI components.

## Implementation approach

- React + TypeScript + Vite for the application shell and component architecture.
- Tailwind CSS for layout and utility styling, with CSS variables and a small custom stylesheet for the design tokens, themes, chart styling, and motion.
- Zustand for projects, tasks, filters, user preferences, activity, and local-storage persistence.
- Recharts for the status donut, completion bar chart, and weekly progress line chart.
- dnd-kit for accessible task drag-and-drop across columns and within-column reordering.
- React Router for Dashboard, Board, and Settings page routes; a task detail view will be a route-aware modal so deep links remain possible.
- Vitest + React Testing Library for focused state, interaction, and accessibility-oriented component tests.
- The build will remain static-host friendly and will include a deployment-ready Vite build configuration for Vercel or Netlify.

## Design direction

### Alternatives considered

1. **Night-shift operations console** — high-contrast dark workspace, luminous status accents, editorial density, and calm motion. Probability: 0.07.
2. **Warm paper planning studio** — cream surfaces, ink typography, coral/blue annotations, and tactile task cards. Probability: 0.05.
3. **Quiet glass productivity system** — soft neutral canvas, frosted panels, restrained indigo accents, and airy hierarchy. Probability: 0.08.

### Selected direction: Night-shift operations console

**Design movement:** A modern editorial operations console inspired by premium developer tools and late-night control rooms, translated into a welcoming project workspace rather than a generic admin template.

**Core principles:** Keep the current work visible at a glance; make status and ownership legible through compact visual cues; use generous spacing around dense task content; make every important action keyboard- and touch-accessible.

**Color philosophy:** A deep ink background creates focus and makes project activity feel intentional. Electric indigo is the ownable action color, while mint, amber, coral, and sky are semantic accents for progress, caution, blocked work, and collaboration. Light mode inverts the canvas but preserves the same semantic accents so the mental model survives the theme change.

**Layout paradigm:** A persistent left rail anchors navigation while the main workspace uses a wide editorial column: a compact context header, a row of high-signal metrics, then a split between the primary board/chart surface and a narrow activity/people rail. On mobile, the rail becomes a drawer and the main content remains a single readable stream.

**Signature elements:** A small four-square TaskFlow mark; thin divider rules with indigo glow at key boundaries; status pills that pair a tiny shape/icon with a plain-language label instead of relying on color alone.

**Interaction philosophy:** Actions should feel immediate but not noisy. Dragging lifts cards with a soft shadow and clear drop target; filters update in place; modals focus the user on one task; toasts confirm saves without interrupting flow; empty and loading states explain what is happening.

**Animation:** Use 150–220ms ease-out transitions for buttons, pills, drawer/modal entry, and theme changes. Use a short lift/scale response for draggable cards and a staggered 40ms reveal for dashboard sections. Respect `prefers-reduced-motion` by reducing transitions to opacity changes or disabling them.

**Typography system:** Use Inter for UI text and Space Grotesk for page titles/brand moments, with a compact uppercase eyebrow style for context labels. Use a clear hierarchy: 12px labels, 14px body/support text, 16px task titles, 24–32px section titles, and 44px dashboard metrics.

**Brand essence:** TaskFlow is the calm command center for teams turning moving parts into momentum. Personality: focused, optimistic, precise.

**Brand voice:** Headlines are direct and energizing; CTAs describe the next useful action. Example lines: “Make the next move visible.” and “Keep the board honest.”

**Wordmark & logo:** A four-tile mark forms an abstract arrow/check shape beside the TaskFlow wordmark; the mark doubles as the favicon and collapsible sidebar emblem.

**Signature brand color:** Electric indigo `#6D5EF8`, reserved for primary actions, active navigation, focus rings, and chart emphasis.

## Application structure

```text
/
├── public/
│   ├── manus-routes.json
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── App.tsx                 # router and app shell composition
│   │   ├── routes.tsx              # page and modal route definitions
│   │   └── providers.tsx           # theme, state, and error boundaries
│   ├── components/
│   │   ├── ui/                     # Button, Card, Badge, Avatar, Input, Modal, Toast
│   │   ├── shell/                  # Sidebar, Header, MobileDrawer, CommandPalette
│   │   ├── dashboard/              # Metric cards, charts, project list, activity feed
│   │   ├── board/                  # Kanban columns, task cards, drag overlay
│   │   ├── task/                   # Task detail modal, form, comments, subtasks
│   │   └── settings/               # preference controls and profile/team settings
│   ├── data/
│   │   ├── mockData.ts             # seeded projects, tasks, team, activity
│   │   └── repository.ts           # local-storage-backed data access boundary
│   ├── hooks/                      # keyboard shortcuts, media queries, toasts
│   ├── lib/                        # date helpers, chart transforms, class utilities
│   ├── store/                      # Zustand slices and persistence
│   ├── styles/                     # tokens, theme variables, global CSS
│   ├── types/                      # Project, Task, User, Activity, filters
│   └── main.tsx
├── tests/                          # state and component tests
├── plan.md
├── TODO.md
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── app.config.ts
```

## Delivery workflow

1. Create the Vite/React/TypeScript foundation and register TypeScript diagnostics.
2. Implement tokens, global theme system, reusable UI primitives, and the app shell.
3. Add typed mock data, Zustand state, local persistence, routing, and the dashboard.
4. Add charts, Kanban drag-and-drop, task modal editing, filters, search, keyboard shortcuts, and responsive behavior.
5. Add tests, README/component notes, route manifest, app logo metadata, and deployment configuration.
6. Run diagnostics, tests, production build, and focused route/asset checks; fix actionable issues.
7. Commit and push the finished source to the managed project repository so it is recoverable as an internship deliverable. Publishing will remain separate unless explicitly requested.

## Acceptance boundary

The implementation will prioritize the complete interactive frontend and a strong internship-demo experience. Real multi-user collaboration, a backend API, authentication, and paid integrations remain intentionally out of scope because the brief explicitly requires mock data/local storage and no backend service.
