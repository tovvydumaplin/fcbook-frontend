# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, hot-reload)
npm run build     # Production build
npm run preview   # Preview production build
```

No test runner and no linter are configured in this project.

## Environment

Copy `.env` and set `VITE_API_URL` to the backend base URL:
```
VITE_API_URL=http://127.0.0.1:8000
```
The `.env.production` file points to the hosted API (`https://fastcat-book.dev/api`). All API calls read `import.meta.env.VITE_API_URL` directly in the component.

The app is served from the `/fcbook-dev/` subpath. This is set in **two** places that must stay in sync: `base` in `vite.config.js` and the `createWebHistory("/fcbook-dev/")` argument in `src/router/index.js`.

## Architecture

**Stack:** Vue 3 (Composition API, `<script setup>`) + Vite + Tailwind CSS v4 + Vue Router 4

**App shell** (`src/App.vue`): Renders `<Header>` and `<SideBar>` for all routes except `/` (Login), `/teller-booking`, and `/teller-refunds`. Those teller routes are full-screen kiosk-style UIs with their own `TellerHeader.vue`. The `<router-view>` is the main content area.

**Auth** (`src/router/index.js`): JWT-based global guard. On login, `Login.vue` stores two `localStorage` keys — `"token"` (the raw JWT) and `"user"` (JSON-stringified user object, read by `Header.vue`, `TellerHeader.vue`, and some modals). The guard decodes the JWT payload client-side to check `exp`; missing/expired tokens clear both keys and redirect to `/`. Every route except `/` requires auth.

**Views** (`src/views/`): Each route maps to a top-level view file (e.g., `ScheduleModule.vue`, `VDARModule.vue`). The `Rates/`, `Agents/`, `Promos/`, `Refunds/`, and `Bookings/` subdirectories follow a **layout + tabs** pattern: a `*Layout.vue` holds an `activeTab` ref and a tab button bar, then `v-if`-switches between sub-views in a `Modules/` folder. `Components/` folders hold reusable panels used by those modules.

**Modals** (`src/components/Modals/`): Modals are self-contained Vue components organized by domain (e.g., `VDAR/`, `Schedule/`, `Vessel/`, `Teller/`). Each modal:
- Receives a `@close` emit and optionally `@save`
- Is conditionally rendered with `v-if` and wrapped in a `<transition name="modal-fade">` in the parent view
- Closes when clicking the backdrop (`@click="$emit('close')"`) and stops propagation on the inner card (`@click.stop`)
- Handles its own API calls and its own fetch/loading state

**API pattern:** There is no centralized API client or service layer — every component calls `fetch` inline:
```js
const apiBase = import.meta.env.VITE_API_URL;
fetch(`${apiBase}/endpoint`, {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})
```
Responses generally follow a `{ success, data, message, errors }` envelope. Follow this pattern rather than introducing an abstraction unless asked.

**Icons:** `@heroicons/vue` icons are registered globally in `main.js` (only the handful listed there — add to that list to use a new one globally). `lucide-vue-next` icons are imported locally per component.

**Alerts/Toasts:** `sweetalert2` (`Swal`) is used for confirmation dialogs and alerts. Simple inline toast notifications are hand-rolled per component with a `<transition>` and a `setTimeout` (e.g., `home.vue`, `Login.vue`).

## Key areas

**Teller booking** (`src/views/tellerBooking.vue`): The largest and most intricate file in the repo (~2,800 lines) — a monolithic multi-step booking flow (date/route/schedule → seat → passengers → vehicles → institutional account → payment) with serial-numbered tabs for concurrent in-progress bookings. **`TELLER-FLOW.md` at the repo root maps every step of this flow to its API endpoint — read it before touching teller booking.** Its supporting modals live in `src/components/Modals/Teller/`.

**VDAR module** (`src/views/VDARModule.vue`, `src/components/Modals/VDAR/`): Handles Vessel Daily Activity Reports. `ModalCreateVDAR.vue` fetches vessels with schedules from `/vessels/with-schedules`.

**`development_reports/`**: Historical, point-in-time reports from past refactors and features (`frontend-docs.md`, `refactor-structure-V2-report.md`, etc.). Useful for background but treat as possibly outdated — verify against the code.
