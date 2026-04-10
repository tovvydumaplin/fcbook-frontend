# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, hot-reload)
npm run build     # Production build
npm run preview   # Preview production build
```

No test runner is configured in this project.

## Environment

Copy `.env` and set `VITE_API_URL` to the backend base URL:
```
VITE_API_URL=http://127.0.0.1:8000
```
The `.env.production` file points to the hosted API. All API calls use `import.meta.env.VITE_API_URL`.

## Architecture

**Stack:** Vue 3 (Composition API, `<script setup>`) + Vite + Tailwind CSS v4 + Vue Router 4

**App shell** (`src/App.vue`): Renders `<Header>` and `<SideBar>` for all routes except `/` (Login) and `/teller-booking`. The `<router-view>` is the main content area.

**Routing** (`src/router/index.js`): JWT-based auth guard. Token is stored in `localStorage` as `"token"`. Expired or missing tokens redirect to `/`. The base path is `/fcbook-dev/`.

**Views** (`src/views/`): Each route maps to a top-level view file (e.g., `ScheduleModule.vue`, `VDARModule.vue`). The `Rates/` and `Agents/` subdirectories contain nested layout views with tab-based sub-modules (`Modules/` folder) and reusable component panels (`Components/` folder).

**Modals** (`src/components/Modals/`): Modals are self-contained Vue components organized by domain (e.g., `VDAR/`, `Schedule/`, `Vessel/`). Each modal:
- Receives a `@close` emit and optionally `@save`
- Is conditionally rendered with `v-if` and wrapped in a `<transition name="modal-fade">` in the parent view
- Closes when clicking the backdrop (`@click="$emit('close')"`) and stops propagation on the inner card (`@click.stop`)
- Handles its own API calls using `fetch` with a `Bearer` token from `localStorage`

**API pattern:** All API calls follow the same pattern — `fetch(${apiBase}/endpoint, { headers: { Authorization: \`Bearer ${localStorage.getItem("token")}\` } })`. There is no centralized API client/service layer.

**Icons:** `@heroicons/vue` icons are registered globally in `main.js`. `lucide-vue-next` icons are imported locally per component.

**Alerts/Toasts:** `sweetalert2` (`Swal`) is used for confirmation dialogs and alerts. Simple inline toast notifications are implemented directly in components (e.g., the success toast in `home.vue`).

**VDAR module** (`src/views/VDARModule.vue`, `src/components/Modals/VDAR/`): Currently active development area (branch `feature/vdar-design-c`). Handles Vessel Daily Activity Reports. `ModalCreateVDAR.vue` fetches vessels with schedules from `/vessels/with-schedules`.
