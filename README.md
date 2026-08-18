# TrackFlow

A sprint tracking and task management application built with React 18 and TypeScript. Teams use it to plan sprints, move work across a kanban board, monitor velocity over time, and coordinate across members.

## Stack

| Layer | Choice |
|---|---|
| UI | React 18 + TypeScript |
| Routing | React Router v6 |
| State | Context + useReducer |
| Build | Vite 4 |
| Tests | Vitest + Testing Library |
| Lint | ESLint + typescript-eslint |
| Node | 20 (pinned via `.nvmrc`) |
| Lockfile | `package-lock.json` |

## Pages

- **Dashboard** — active sprint stats, countdown timer, recent activity, team overview
- **Board** — filterable kanban board with drag-and-drop between status columns
- **Reports** — velocity chart across sprints with per-sprint breakdown
- **Team** — member cards showing assigned, active, and completed task counts

## Getting started

```bash
node --version   # must be 20.x
npm install
npm run dev      # http://localhost:5173
```

## Scripts

```bash
npm test           # run all tests (vitest run)
npm run test:watch # watch mode
npm run typecheck  # tsc --noEmit
npm run lint       # eslint src
npm run build      # tsc + vite build
```

## Project structure

```
src/
  types/        # shared TypeScript interfaces and union types
  data/         # seed data (users, sprints, tasks, labels, comments)
  context/      # AppContext, useReducer, and all action types
  hooks/        # useApp, useWindowSize
  lib/          # pure utility functions (filterTasks, formatDate, etc.)
  components/   # SprintTimer, SprintStats, TaskList, FilterBar,
                #   AddTaskForm, KanbanBoard, TaskDetail, TeamGrid,
                #   VelocityChart
  pages/        # DashboardPage, BoardPage, ReportsPage, TeamPage
```

## Running tests

```bash
npm test
```

Three test files, 38 tests total:

| File | Coverage |
|---|---|
| `src/lib/utils.test.ts` | filterTasks, formatDate, priorityRank, sprintProgress, groupByStatus, generateId |
| `src/context/reducer.test.ts` | all reducer actions |
| `src/components/components.test.tsx` | SprintTimer, TaskList, SprintStats, AddTaskForm, KanbanBoard, VelocityChart |

Tests do not require credentials, external services, or machine-specific files. All data is seeded in memory from `src/data/seed.ts`.
