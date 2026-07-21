# FCBook Frontend — Architecture Guide

Overview of the FastCat ferry booking & management frontend, intended both as an onboarding guide for the development team and as context for AI coding assistants.

**Scope note:** This describes the frontend only. The backend (a Laravel-style JSON API, inferred from its response envelope and route shapes) lives in a separate repository. Endpoint behaviour documented here is inferred from the calling code, not from backend source.

---

## 1. What this application is

A ferry operations back-office and point-of-sale system for FastCat. It covers two broad concerns:

1. **Administration** — managing the reference data that makes booking possible: ports, vessels (and their seatmaps), routes, schedules, accommodation classes, fares, passenger types, vehicles, promos/discounts, and agents.
2. **Operations** — the teller-facing point-of-sale used to sell tickets at the terminal, plus refunds, passenger monitoring, and daily vessel activity reporting (VDAR).

### Domain model

The core entities form a chain, and understanding it explains most of the module layout:

```
Port ──┐
       ├──> Route (origin port → destination port)
Port ──┘        │
                ├──> Schedule (route + vessel + departure time)
Vessel ─────────┘        │
   │                     │
   ├── Accommodations (Economy, Premium Economy, Business, PWD …)
   ├── Seatmap / layout (rows × columns of seats per class)
   │                     │
   └─────────────────────┴──> Booking (serial no.)
                                 ├── Booked passengers (seat, type, discount)
                                 ├── Booked vehicles (type, plate, driver)
                                 └── Payment → Ticket / E-ticket / Bill of Lading
```

Fares are resolved **per route**, not per schedule: `accommodation-rates/route/{id}` for passengers and `vehicle-rates/route/{id}` for vehicles.

---

## 2. Stack

| Concern | Choice |
|---|---|
| Framework | Vue 3, Composition API, `<script setup>` exclusively |
| Build | Vite 7 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`, not PostCSS config) |
| Routing | Vue Router 4 (`createWebHistory`) |
| Icons | `@heroicons/vue` (few, global) + `lucide-vue-next` (most, local) |
| Dialogs | `sweetalert2` |
| State | **None** — no Pinia/Vuex. See §6. |
| Types | **None** — plain JS, no TypeScript |
| Tests | **None** — no test runner configured |
| Lint | **None** — no ESLint/Prettier config committed |

~26,000 lines across ~90 source files.

### Commands

```bash
npm run dev       # Vite dev server, hot-reload
npm run build     # Production build → dist/
npm run preview   # Serve the production build locally
```

There is no `test`, `lint`, or `format` script. Verification today is manual, in-browser.

### Environment

A single variable drives everything:

```
# .env (local)
VITE_API_URL=http://127.0.0.1:8000

# .env.production
VITE_API_URL=https://fastcat-book.dev/api
```

Note the asymmetry: **production includes the `/api` suffix, local does not.** This is a live footgun — see §10.

The app is served from the **`/fcbook-dev/` subpath**, configured in two places that must stay in sync:
- `base` in `vite.config.js`
- `createWebHistory("/fcbook-dev/")` in `src/router/index.js`

---

## 3. Directory structure

```
src/
├── main.js                 App bootstrap; registers a few global icons
├── App.vue                 Shell: conditional Header + SideBar + <router-view>
├── router/index.js         Route table + JWT auth guard
├── assets/main.css         Tailwind import + shared utility/transition classes
├── style.css               Legacy/base styles
├── components/
│   ├── Header.vue          Admin header: user menu, logout
│   ├── TellerHeader.vue    Header for full-screen teller routes
│   ├── sideBar.vue         Grouped, collapsible nav
│   └── Modals/             ~50 modals, grouped by domain
│       ├── Teller/         Booking flow modals (payment, vehicle, IA, bookings list)
│       ├── Vessel/         Vessel CRUD + Seatmap/ (create, block seats)
│       ├── VDAR/           Daily activity + cancellation reports
│       ├── Schedule/  Port/  Route/  Vehicle/  Promo/  Discount/
│       ├── Passenger/      Accommodation + PassengerType
│       ├── InstitutionalAccount/  Merchant/   AddOn/   Refund/
└── views/
    ├── Login.vue           Two-step (username → password) sign-in
    ├── home.vue            Dashboard — placeholder, "under construction"
    ├── tellerBooking.vue   ★ The POS. ~2,800 lines. See §8.
    ├── PortModule.vue  RoutesModule.vue  VesselsModule.vue
    ├── ScheduleModule.vue  VehiclesModule.vue  VDARModule.vue
    ├── PassengerAccommodation.vue   PassengerMonitoringModule.vue
    ├── Rates/    Agents/    Promos/    Refunds/    Bookings/   (layout + tabs)
    └── Tellers/RefundsModule.vue     Full-screen teller refunds
```

### The `Layout + Modules + Components` convention

Any view directory (`Rates/`, `Agents/`, `Promos/`, `Refunds/`) follows the same shape:

- **`*Layout.vue`** — owns an `activeTab` ref and a tab-button bar, then `v-if`-switches between sub-views. Purely presentational; no data fetching.
- **`Modules/`** — the sub-views the tabs switch between. These fetch their own data.
- **`Components/`** — reusable panels used by those modules (e.g. `IADetailsComponent.vue`).

Tabs are **not** routes — they are local state. Deep-linking to a tab is not currently possible, and a page refresh resets to the first tab.

`Agents/` nests this one level deeper: `AgentsLayout` → `Modules/MerchantLayout` → its own `Components/`.

---

## 4. Application shell

`App.vue` renders `<Header>` and `<SideBar>` for every route **except** three, which are full-screen:

- `/` — Login
- `/teller-booking` — POS
- `/teller-refunds` — teller refunds

Those teller routes bring their own `TellerHeader.vue`. The exclusion is a hard-coded path list in `App.vue`, duplicated between the Header and SideBar `v-if`s — adding a fourth full-screen route means editing both conditions.

### Navigation

`sideBar.vue` groups links into four collapsible sections, each an array of `{ name, route, icon }`:

- **Modules** — Ports, Vessels, Routes, Schedules, Accommodation, Agents, Rates, Promos, Vehicles, Passenger Monitoring
- **Booking Modules** — Teller Booking, Refunds
- **Logs and Reports** — VDAR
- **System** — Settings, Profile *(both dead links — no such routes exist)*

---

## 5. Routing & authentication

### Route table (`src/router/index.js`)

All routes are flat and eagerly imported — no lazy loading, no nested routes, no named routes, no route metadata.

| Path | View |
|---|---|
| `/` | Login *(public)* |
| `/dashboard` | home.vue |
| `/ports` `/vessels` `/routes` `/schedules` | Admin CRUD modules |
| `/passenger-accommodation` `/vehicles` `/passenger-monitoring` | Admin CRUD modules |
| `/rates` `/agents` `/promos` | Layout + tabs modules |
| `/vdar` | VDAR reports |
| `/teller-booking` | POS *(full-screen)* |
| `/refunds` | Refunds layout |
| `/teller-refunds` | Teller refunds *(full-screen)* |

### Auth flow

1. `Login.vue` posts to `POST /login` with `{ email, password }`. The field is labelled "Username" in the UI but sent as `email`.
2. On success it writes two `localStorage` keys:
   - **`token`** — the raw JWT
   - **`user`** — JSON-stringified user object, later read by `Header.vue`, `TellerHeader.vue`, `tellerBooking.vue`, and `ModalCreatePort.vue`
3. A global `router.beforeEach` guard treats every path except `/` as protected. It **decodes the JWT payload client-side** (`atob` on segment 1) and compares `exp` to `Date.now()`. Any parse failure is treated as expired.
4. Expired/missing → clears both keys, redirects to `/`. Already-authenticated users hitting `/` are bounced to `/dashboard`.

**There is no role/permission system.** Every authenticated user can reach every route. The `user` object is used only for display (name/initials) and to stamp a creator ID on some records. Authorization is assumed to be enforced backend-side.

**There is no token refresh and no 401 interceptor.** Because each component calls `fetch` directly, a token that expires mid-session produces failed requests inside whatever component is active, and the user is only redirected on the *next* navigation.

---

## 6. Data layer

**There is no data layer.** This is the single most important architectural fact about the codebase.

There is no API client, no service module, no store, no composable wrapper. Every component that needs data calls `fetch` inline. The pattern, repeated ~58 times:

```js
const apiBase = import.meta.env.VITE_API_URL;

const fetchThings = async () => {
  isTableLoading.value = true;
  try {
    const res = await fetch(`${apiBase}/things`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const json = await res.json();
    things.value = json.data ?? [];
  } catch (e) {
    console.error(e);
  } finally {
    isTableLoading.value = false;
  }
};

onMounted(fetchThings);
```

Responses generally follow a `{ success, data, message, errors }` envelope, where `errors` is a field-keyed map of arrays (`errors.email[0]`) — the Laravel validation shape.

### Consequences to be aware of

- **No caching.** Ports, routes, and passenger types are re-fetched from scratch by every view and modal that needs them.
- **No shared state.** Parent/child sync is done with props down, emits up, and a `fetchX()` re-fetch after every save.
- **Error handling is per-call and inconsistent** — some `console.error`, some `Swal`, some set an `errorMsg` ref, some swallow silently.
- **58 copies of the auth header.** Any change to auth transport means touching every file.

If a refactor is ever undertaken, extracting a single `api.js` wrapper is the highest-leverage change available and would resolve most of §10 at once.

### API surface

Every endpoint the frontend calls, grouped by domain:

**Auth**
```
POST   /login
POST   /api/logout                      ⚠ see §10
```

**Reference data / admin CRUD** — each supports the usual list/create/update/delete
```
GET    /ports
GET    /routes
GET    /routes/with-schedules
GET    /vessels
GET    /vessels/with-schedules
GET    /vessels/{id}/layout             seatmap for booking
GET    /vessels/{id}/accommodations
GET    /vessels/{id}/vdars
GET    /schedules/{id}
GET    /passenger-accommodations
GET    /passenger-categories            accommodation classes
GET    /passenger-types                 Regular, Student, Senior …
GET    /vehicles
GET    /add-ons
```

**Fares** — resolved per route
```
GET    /accommodation-rates/route/{routeId}
GET    /vehicle-rates/route/{routeId}
```

**Promos & discounts**
```
GET    /promos          /promos/{id}
GET    /discounts       /discounts/{id}
```

**Agents — institutional accounts & merchants**
```
GET    /institutional-accounts                    /{id}
GET    /institutional-accounts/discounts          /{id}/discounts
POST   /institutional-accounts/{id}/reset-password
GET    /merchants                                 /{id}
GET    /merchants/discounts                       /{id}/discounts
POST   /merchants/{id}/reset-password
```

**Teller booking** — the POS flow; see `TELLER-FLOW.md` for step-by-step mapping
```
GET    /teller-booking/bookings                 in-progress tabs
GET    /teller-booking/bookings/{serial}        full tab detail
DELETE /teller-booking/bookings/{serial}        cancel whole booking
GET    /teller-booking/booked-seats?schedule_id=&travel_date=
POST   /teller-booking/booked-passengers
DELETE /teller-booking/booked-passengers/{id}
POST   /teller-booking/booked-vehicles
PATCH  /teller-booking/booked-vehicles/{id}     assign driver
DELETE /teller-booking/booked-vehicles/{id}
POST   /teller-booking/payment                  finalize
GET    /teller-booking/completed-bookings       /{id}
GET    /teller-booking/generate-ticket?booking_number=
GET    /teller-booking/generate-eticket?booking_number=
GET    /teller-booking/generate-waybill?booking_number=   vehicles only
```

**VDAR**
```
GET    /vdar
GET    /cancellation-reports
GET    /account/users/vessel-masters
```

**Assets** — `${apiBase}/storage/{path}` for uploaded images (e.g. IA logos).

---

## 7. UI conventions

### Modals

~50 modals in `src/components/Modals/`, grouped by domain. Each is self-contained: it owns its own fetches, loading state, validation, and error display. The contract:

```vue
<!-- parent -->
<transition name="modal-fade">
  <ModalCreateThing
    v-if="isCreateModalOpen"
    :thing="selectedThing"
    @close="isCreateModalOpen = false"
    @save="handleSaved"
  />
</transition>
```

```vue
<!-- modal root -->
<div class="fixed inset-0 …" @click="$emit('close')">
  <div class="modal-card" @click.stop> … </div>
</div>
```

- Backdrop click closes; the inner `.modal-card` stops propagation.
- `modal-fade` and `.modal-card` transitions are defined once in `assets/main.css` (and respect `prefers-reduced-motion`).
- The dominant emit contract is `["close", "save"]` — though the ordering is inconsistent across files (`["close","save"]` in 19, `["save","close"]` in 10) and some use `saved`/`select`/`edit` instead. Mildly annoying but harmless.
- The parent re-fetches its list on `@save` rather than merging the response.

### List/CRUD modules

Almost every admin view is the same shape, and `VesselsModule.vue` is the canonical reference:

- `ref([])` for rows, `isTableLoading` for the spinner
- A `status` map from numeric codes to `{ label, class }` Tailwind badge classes
- A `tabs` array + `activeTab` for client-side filtering
- `searchQuery` + a `computed` filter (all filtering and searching is **client-side**, over the full list)
- Modal-open booleans, one per modal
- `onMounted(fetchX)`, and `fetchX()` again after every save

### Toasts & dialogs

Two parallel systems, chosen ad hoc:

- **SweetAlert2** (`Swal`) — used in 22 components for confirmations and result alerts.
- **Hand-rolled inline toasts** — a `successMsg` ref, a `<transition>` with Tailwind enter/leave classes, and a `setTimeout(…, 2200)` to clear. Copy-pasted verbatim across `Login.vue`, `home.vue`, and others.

### Styling

Tailwind v4, utility-first, in-template. Shared additions live in `assets/main.css`:
- `.btn-active` / `.selected__bg` — the blue selected-button state (`#155dfc` brand blue)
- `.no-scrollbar` — cross-browser scrollbar hiding
- `.modal-fade` / `.modal-card` transitions
- `.brand-color`, `.bg-brand-color*`

A handful of components also use `<style scoped>` for keyframe animations (`Login.vue`, `home.vue`) or fixed-height chrome (`Header.vue`).

---

## 8. Deep dive: `tellerBooking.vue`

The point-of-sale. **~2,800 lines in a single `<script setup>`** — roughly 11% of the codebase, ~120 top-level declarations, 17 of the app's fetch calls. It is the highest-risk file to change and the one most in need of decomposition.

> **Read `TELLER-FLOW.md` at the repo root before touching it.** It maps every step of the flow to its endpoint.

### The flow

1. **Date / route / schedule** — selecting a route triggers `fetchRates(routeId)`.
2. **Seat** — pick accommodation class → `GET /vessels/{id}/layout` for the seatmap, `GET /teller-booking/booked-seats` to grey out taken seats, plus backend-blocked seats. First available seat is auto-assigned; the teller can override (`isManualSeatSelection`).
3. **Passenger details** — name, type, gender, optional discount → `POST /teller-booking/booked-passengers`.
4. **Vehicle** *(optional)* — type + plate → `POST /teller-booking/booked-vehicles`; a driver can be assigned from the already-booked passengers via `PATCH`.
5. **Institutional account** *(optional)* — checkbox → IA modal → applied on save.
6. **Payment** — `POST /teller-booking/payment` finalizes, then optional ticket generation.

### Serial tabs

Each transaction gets a serial (`BK-1234567890-001`), letting one teller juggle several in-progress bookings as tabs. `applySerialContext(serial)` rehydrates the entire form state from `GET /teller-booking/bookings/{serial}`. Closing a tab cancels the whole booking server-side in one `DELETE`.

This tab machinery is the most intricate part of the file — form state, fetched state, and tab identity are all interleaved in flat refs with no isolation between tabs.

### Money

Totals are `computed` chains: `totalPassengerFare`, `totalVehicleFare`, `totalCargo`, `totalAdmin`, `totalDiscount` → `totalAmount`. Two aliases (`totalOriginalFare`, `totalFare`) point at `totalPassengerFare` — vestigial. Discounts resolve through `getDiscountAmount(fare)` against the selected discount.

`ModalPaymentSelection.vue` additionally implements **manager-key verification** to authorize discounts at the point of payment.

### Hard-coded data

Several arrays are hard-coded rather than fetched, and coexist with fetched equivalents: `rates`, `adminFees`, `ports`, `accommodations`, `genders`, and the initial value of `discounts`. `originPort`/`destinationPort` default to the literal strings `"Batangas Port"` / `"Calapan Port"`. Treat any of these as suspect when debugging fare or route bugs — check whether the fetched or the hard-coded copy is winning.

`schedules` is explicitly commented "will be deprecated, kept for compatibility"; `allSchedules` is the live one.

---

## 9. Module maturity

Not all modules are equally real. This matters a lot for anyone picking up a ticket:

| Module | State |
|---|---|
| Teller Booking | **Production-grade.** Fully wired, most active development. |
| Vessels (+ seatmap, accommodations, block seats) | Fully wired |
| Ports, Routes, Schedules, Vehicles | Fully wired |
| Rates, Passenger Types, Accommodation | Fully wired |
| Promos, Discounts | Fully wired |
| Agents (IA + Merchants) | Fully wired |
| VDAR | Fully wired |
| **Refunds** (`Refunds/Modules/*`, `Tellers/RefundsModule`) | **Mock only.** `fetchBookings()` maps a local `walkin-data.json` / `selfbook-data.json`. No backend. |
| **Passenger Monitoring** | **Mock only.** `mockPassengerResponse` hard-coded in the view. |
| **Dashboard** (`home.vue`) | **Placeholder.** "Your dashboard is under construction." |
| **Bookings** (`Bookings/BookingsLayout.vue`) | **Empty file (0 bytes).** Unrouted. |

---

## 10. Known issues & technical debt

Verified by reading the code. Roughly in priority order.

### Bugs that will bite in production

1. **`TellerHeader.vue:39` hard-codes `http://127.0.0.1:8000/api/logout`.** Ignores `VITE_API_URL` entirely — teller logout cannot work in any deployed environment.
2. **Double `/api` in logout.** `Header.vue:46` calls `` `${apiBase}/api/logout` ``, but production `apiBase` is already `https://fastcat-book.dev/api` → resolves to `/api/api/logout`. Local and production disagree about whether `/api` belongs in the base URL, and this is the seam where it shows.
3. **`Header.vue:50` sends `Authorization: token`** — no `Bearer ` prefix, unlike all 57 other call sites.
4. **`App.vue:2` imports `./components/SideBar.vue`; the file on disk is `sideBar.vue`.** Works on Windows/macOS (case-insensitive), **breaks any case-sensitive filesystem** — Linux CI, Docker builds.
5. **Sidebar "Dashboard" links to `/`**, which is Login, not `/dashboard`. Clicking it while signed in relies on the guard's bounce-back to recover.
6. **`/settings` and `/profile` are dead sidebar links** — no such routes; they render blank.

### Structural debt

7. **No API layer** (§6) — 58 duplicated auth headers, no 401 handling, no caching, inconsistent error handling.
8. **`tellerBooking.vue` at 2,800 lines** — the flow steps, seatmap logic, tab machinery, and money math all belong in separate composables.
9. **Client-side-only search & filtering** across every list view. Fine at current data volumes; will not survive real production tables.
10. **Client-side JWT expiry check only** — `atob`-decoding without signature verification is fine for UX, but there is no interceptor for a server-side 401.
11. **Empty committed files** — `Bookings/BookingsLayout.vue` and `Modals/Teller/ModalPassengerDriver.vue` are both 0 bytes.
12. **`console.log` left in production paths** — including `Login.vue:32-33`, which logs the full login response and API base to the browser console.
13. **Tabs are local state, not routes** — no deep-linking, no back-button support, resets on refresh.
14. **No tests, no linter, no formatter, no CI** — nothing mechanically enforces any of the conventions above.
15. **`README.md` is still the stock Vite template** and says nothing about this project.

---

## 11. Working in this codebase

### Conventions to follow

- Vue 3 `<script setup>`, Composition API. No Options API anywhere — don't introduce it.
- Match the surrounding fetch pattern (§6) rather than introducing an abstraction for one component. If you want an API layer, do it deliberately and everywhere — a half-migration is worse than either end state.
- New modal → `src/components/Modals/<Domain>/Modal<Verb><Thing>.vue`, emitting `["close", "save"]`, backdrop-click to close, `@click.stop` on the card.
- New tab in an existing area → add to the `tabs` array in the relevant `*Layout.vue` and `v-if` a module component.
- Icons: `lucide-vue-next`, imported locally. Only add to `main.js`'s global registration if it's genuinely used everywhere.
- Tailwind utilities in-template; only reach for `assets/main.css` if it's shared across several components.

### Verification

There are no tests. Verify changes by running `npm run dev` and exercising the actual flow in the browser. For teller booking specifically, this means walking the full sequence — date → route → schedule → seat → passenger → payment — since the steps share mutable state and breakage tends to surface a step or two after the change.

### Reference docs in this repo

| File | Contents |
|---|---|
| `TELLER-FLOW.md` | Step-by-step teller booking flow → endpoint mapping. Authoritative for §8. |
| `CLAUDE.md` | Condensed conventions for AI assistants. |
| `development_reports/` | Historical point-in-time reports from past refactors/features. Useful background; **verify against code before trusting.** |
| `README.md` | Stock Vite boilerplate. Ignore. |
