# TaskFlow — Internship Deliverables

## Foundation and design system

- [x] Create a Vite + React + TypeScript application with a clear component-based folder structure.
- [x] Implement the selected night-shift operations-console visual system with design tokens for colors, typography, spacing, surfaces, semantic status colors, focus rings, and reduced-motion behavior.
- [x] Add the TaskFlow wordmark/mark, browser metadata, favicon, and `app.config.ts` logo metadata.

## Application shell and navigation

- [x] Build the App Shell with Sidebar, Header, and Main Content Area.
- [x] Add Dashboard, Board, and Settings routes using React Router v6.
- [x] Include global search, profile/team controls, active navigation state, mobile sidebar drawer, and keyboard-accessible navigation.

## Dashboard and visualization

- [x] Build dashboard stats for total tasks, in-progress work, completed work, and overdue work.
- [x] Add project list, activity feed, team/assignee cues, loading skeletons, and responsive dashboard sections.
- [x] Add interactive status-distribution pie/donut chart, task-completion bar chart, and weekly-progress timeline chart.

## Kanban and task workflow

- [x] Build To Do, In Progress, Review, and Done columns with task cards showing priority, tags, assignee, due date, and progress cues.
- [x] Support drag-and-drop across columns and reordering within columns with dnd-kit.
- [x] Add task creation/editing with title, description, priority, tags, assignee, due date, comments, and subtask checklist.
- [x] Add task detail modal with focus management, close behavior, and keyboard support.
- [x] Add filtering and sorting by priority, assignee, date, and tags plus global search.

## State, persistence, and preferences

- [x] Use Zustand for projects, tasks, filters, activity, and user preferences.
- [x] Persist theme, filters, and task changes through local storage with typed mock JSON data structured for future backend integration.
- [x] Implement dark/light mode with system preference detection, persistent preference, and smooth transitions.
- [x] Implement keyboard shortcuts for common actions and toast feedback for saves/actions.

## Quality and delivery

- [x] Make layouts responsive for mobile under 640px, tablet 640–1024px, and desktop above 1024px, including touch-friendly board interaction.
- [x] Provide ARIA labels, visible focus states, keyboard navigation, semantic status indicators, and reduced-motion support.
- [x] Add Vitest + React Testing Library tests for state updates and key interactions.
- [x] Add `public/manus-routes.json`, README setup instructions, feature overview, screenshots/demo notes, and design rationale.
- [x] Run diagnostics, tests, production build, and route/asset checks; fix actionable issues.
- [x] Commit the internship project to the managed repository. Keep publishing separate unless requested.
