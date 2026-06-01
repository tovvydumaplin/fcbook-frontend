# Teller Booking Flow

## On Page Load
- `GET /routes/with-schedules` — load routes and schedules
- `GET /passenger-types` — load types, auto-select Regular
- `GET /passenger-categories` — load accommodation classes
- `GET /discounts` — load discounts
- `GET /teller-booking/bookings` — load existing serial tabs

---

## Step 1 — Pick Date, Route, Schedule

Teller selects travel date, route, and a schedule button.

When a route is selected:
- `GET /accommodation-rates/route/{routeId}` — load fares per accommodation

---

## Step 2 — Seat

Teller selects accommodation class (Economy, Premium Economy, Business, PWD).

- `GET /vessels/{vesselId}/layout` — fetch seatmap for the vessel
- `GET /teller-booking/booked-seats?schedule_id=&travel_date=` — mark already taken seats

First available seat is auto-assigned. Teller can choose manually.

---

## Step 3 — Passenger Details

Teller fills in name, passenger type, gender. Discount is optional.

**Book the passenger:**
- `POST /teller-booking/booked-passengers`

**Remove a passenger:**
- `DELETE /teller-booking/booked-passengers/{id}`

---

## Step 4 — Vehicle (optional)

Teller switches to Vehicle tab, opens vehicle modal to pick type + plate.

**Book the vehicle:**
- `POST /teller-booking/booked-vehicles`

**Assign a driver (from the booked passengers):**
- `PATCH /teller-booking/booked-vehicles/{id}`

**Remove a vehicle:**
- `DELETE /teller-booking/booked-vehicles/{id}`

---

## Step 5 — Institutional Account (optional)

Teller checks I.A checkbox → opens IA modal to select an institution.

- `GET /institutional-accounts` — load list of institutional accounts (fetched on modal open)

Applied to the booking on save.

---

## Step 6 — Payment

Teller clicks Proceed to Payment.

- `POST /teller-booking/payment` — finalizes the booking, creates payment record

After success, optionally generate the ticket:
- `GET /teller-booking/generate-ticket?booking_number=`

---

## Serial Tabs

Each transaction has a serial number (e.g. `BK-1234567890-001`).
Tabs let the teller manage multiple in-progress bookings.

- `GET /teller-booking/bookings` — list of incomplete bookings (tabs, teller UI only)
- `GET /teller-booking/bookings/{serial}` — full detail for a tab (passengers + vehicles, teller UI only)

Closing a tab deletes all its passengers and vehicles from the backend.

---

## View Completed Bookings (Modal)

Teller opens the Completed Bookings modal from the header.

- `GET /teller-booking/completed-bookings` — list of paid bookings
- `GET /teller-booking/completed-bookings/{id}` — detail (passengers, vehicles, payment info)

From the detail view, teller can generate documents:

| Button | Endpoint |
|---|---|
| Generate E-Ticket | `GET /teller-booking/generate-eticket?booking_number=` |
| Generate Ticket | `GET /teller-booking/generate-ticket?booking_number=` |
| Bill of Lading | `GET /teller-booking/generate-waybill?booking_number=` (vehicles only) |
