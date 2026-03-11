# FCBook Frontend Development Report

## Table of Contents

1. [Teller Booking Module](#teller-booking-module)
2. [Schedule Management Module](#schedule-management-module)
3. [UI/UX Enhancements](#uiux-enhancements)
4. [Authentication Feedback](#authentication-feedback)
5. [Technical Improvements](#technical-improvements)
6. [Future Enhancements (Recommended)](#future-enhancements-recommended)
7. [Conclusion](#conclusion)

---

## Teller Booking Module

### Overview

The Teller Booking module (`tellerBooking.vue`) has been significantly enhanced to provide a more intuitive and route-based booking experience for ferry operators.

### Key Features Implemented

#### 1. Route-Based Schedule Filtering

**Problem Solved:** Previously, schedules were fetched as a flat list without clear route organization, making it difficult for tellers to select the correct schedule for a passenger's journey.

**Implementation:**

- Changed from individual port selection to complete route selection
- Integrated with `/routes/with-schedules` API endpoint to fetch routes with their associated schedules
- Schedules are now automatically filtered based on the selected route

**Technical Details:**

```javascript
// API Integration
const response = await fetch(`${apiBase}/routes/with-schedules`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: authHeader,
  },
});

// Data Structure
allSchedules.value = [
  {
    id: scheduleId,
    time: departureTime,
    code: vesselName,
    routeId: routeId,
    departurePort: portName,
    arrivalPort: destinationPortName,
  },
];
```

#### 2. Bi-Directional Schedule Display

**Feature:** Schedules are now displayed in two separate sections showing both directions of travel for a route.

**UI Organization:**

```
Route: Batangas Port → Calapan Port

Schedules:
├── Batangas Port → Calapan Port
│   ├── 07:00 (FCM15)
│   ├── 12:00 (FCM19)
│   └── 15:00 (No vessel)
│
└── Calapan Port → Batangas Port
    ├── 08:30 (FCM15)
    ├── 13:30 (FCM19)
    └── 16:30 (No vessel)
```

**Benefits:**

- Clear visual separation between schedule directions
- Tellers can easily identify departure and arrival ports
- Reduced booking errors from selecting wrong direction schedules

#### 3. Return Trip Toggle

**Feature:** Added a "Return Trip" checkbox that allows quick switching between route directions.

**Functionality:**

- Automatically swaps origin and destination ports when toggled
- Clears selected schedule to prevent confusion
- Updates passenger booking information dynamically

**Code Implementation:**

```javascript
watch(returnTrip, () => {
  selectedSchedule.value = null;
  if (selectedRoute.value) {
    if (returnTrip.value) {
      originPort.value = selectedRoute.value.portB?.port_name;
      destinationPort.value = selectedRoute.value.portA?.port_name;
    } else {
      originPort.value = selectedRoute.value.portA?.port_name;
      destinationPort.value = selectedRoute.value.portB?.port_name;
    }
  }
});
```

#### 4. Enhanced Schedule Selection

**Problem Fixed:** Previously, selecting a schedule by time value caused multiple schedules with the same time to be selected simultaneously.

**Solution:**

- Changed from storing time string to storing complete schedule object
- Implemented unique ID-based comparison for schedule selection
- Each schedule now maintains its full context (departure port, arrival port, vessel)

**Before:**

```javascript
selectedSchedule.value = "08:00:00"; // Multiple schedules could match
```

**After:**

```javascript
selectedSchedule.value = {
  id: 7,
  time: "08:00:00",
  code: "FCM15",
  departurePort: "Batangas Port",
  arrivalPort: "Calapan Port",
  routeId: 1,
}; // Unique schedule object
```

#### 5. Improved Visual Feedback

**Features:**

- All schedules remain visible after selection (no hiding)
- Selected schedule is highlighted with blue background
- Unselected schedules maintain white background with hover effects
- Smooth transitions between selection states

**CSS Classes:**

```javascript
:class="[
  'p-3 text-center rounded-lg text-base border-2 transition-all duration-300',
  selectedSchedule?.id === time.id
    ? 'border-2 bg-blue-900 text-white'
    : 'bg-white text-gray-700 border-gray-300 hover:shadow-[0_0_0_2px_#3b3b3b]',
]"
```

### Data Flow

1. **On Component Mount:**
   - Fetch routes with schedules from API
   - Parse and separate schedules by route and direction
   - Set default route (first in list)

2. **Route Selection:**
   - User selects a route from dropdown
   - `filteredSchedules` computed property filters schedules by route ID
   - Schedules grouped by departure port (portA and portB)
   - Origin and destination ports automatically updated

3. **Schedule Selection:**
   - User clicks a schedule button
   - Complete schedule object stored in `selectedSchedule`
   - Departure and arrival ports confirmed from schedule data
   - Schedule displayed in booking summary

4. **Booking Entry:**
   - Schedule time extracted for passenger booking record
   - Route information stored as "Origin - Destination" string
   - All schedule metadata preserved for reference

### Bug Fixes

#### Issue 1: Double Schedule Selection

**Symptom:** Clicking one schedule would highlight two schedules
**Cause:** Multiple schedules with same departure time
**Fix:** Changed comparison from time string to unique schedule ID

#### Issue 2: Reference Before Initialization

**Symptom:** `ReferenceError: Cannot access 'selectedSchedule' before initialization`
**Cause:** Watch statement used `selectedSchedule` before it was declared
**Fix:** Moved all ref declarations before watch statements

### Seatmap Integration

#### 6. Dynamic Seatmap Display

**Feature Overview:**
The teller booking module now displays an interactive seatmap that dynamically loads based on the selected vessel and accommodation class. This provides visual seat selection capability for tellers during the booking process.

**Implementation:**

**API Integration:**

- Fetches vessel layout from `/vessels/{vesselId}/layout` endpoint
- Vessel ID is extracted from the selected schedule's vessel data
- Response structure: `{name, status, classes: [{name, seats: [...]}]}`

**Reactive Seat Loading:**

```javascript
watch(selectedAccommodation, async (newAccommodation) => {
  if (!newAccommodation || !selectedSchedule.value?.vesselId) {
    vesselSeatmap.value = null;
    availableSeats.value = [];
    selectedSeat.value = null;
    return;
  }

  const response = await fetch(
    `${apiBase}/vessels/${selectedSchedule.value.vesselId}/layout`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    },
  );

  const result = await response.json();
  const classes = result.classes || [];

  // Find matching accommodation class
  const selectedClass = classes.find((cls) => cls.name === newAccommodation);

  if (selectedClass) {
    availableSeats.value = selectedClass.seats || [];

    // Mark already booked seats as blocked
    passengers.value.forEach((passenger) => {
      if (passenger.accommodation === newAccommodation && passenger.seat) {
        const seat = availableSeats.value.find(
          (s) => s.seat_no === passenger.seat,
        );
        if (seat) {
          seat.blocked = true;
        }
      }
    });
  }
});
```

**Seatmap Visual Design:**

- Absolute positioning layout matching vessel module design
- 40px × 40px seat size for consistent display
- Color-coded seat states:
  - **Gray (bg-gray-100)**: Available seats
  - **Blue (bg-blue-600)**: Selected seat
  - **Gray (bg-gray-300)**: Path/walkway seats
  - **Red (bg-red-700)**: Blocked seats (with ✕ symbol)
  - **Orange (bg-orange-400)**: Facility seats (restroom, etc.)

**Layout Code:**

```javascript
<div class="relative h-[350px] overflow-auto border rounded-lg p-2 bg-gray-50">
  <div class="relative w-full h-full">
    <!-- Title and Selected Class Badge -->
    <div class="flex items-center justify-center gap-3 mb-3">
      <p class="text-sm font-medium text-gray-700">Seatmap Preview</p>
      <span class="px-3 py-1 bg-blue-900 text-white text-xs font-semibold rounded-full">
        {{ selectedAccommodation }}
      </span>
    </div>

    <!-- Seats with Absolute Positioning -->
    <div
      v-for="seat in availableSeats"
      :key="seat.seat_no"
      class="absolute flex items-center justify-center border rounded-md text-xs font-medium cursor-pointer"
      :style="{
        width: '40px',
        height: '40px',
        top: seat.row * 40 + 'px',
        left: seat.col * 40 + 'px',
      }"
      :class="{
        'bg-gray-300 cursor-not-allowed': seat.path,
        'bg-red-700 text-white cursor-not-allowed': seat.blocked,
        'bg-gray-100 hover:bg-green-100': !seat.path && !seat.blocked && !seat.facility,
        'bg-orange-400 text-white cursor-not-allowed': seat.facility,
        'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400': selectedSeat?.seat_no === seat.seat_no,
      }"
      @click="!seat.blocked && !seat.path && !seat.facility ? (selectedSeat = seat) : null"
    >
      <span v-if="!seat.blocked && !seat.path && !seat.facility">
        {{ seat.seat_no }}
      </span>
      <span v-if="seat.facility">{{ seat.facility }}</span>
      <span v-if="seat.blocked">✕</span>
    </div>
  </div>
</div>
```

**Visual Enhancements:**

- **Class Badge Display**: Shows the currently selected accommodation class (e.g., "Business Class", "Economy Class") in a blue rounded badge above the seatmap
- **Clear Visual Hierarchy**: Badge positioned next to the "Seatmap Preview" title for immediate recognition
- **Responsive Design**: Badge adapts to different class name lengths

**Seat Properties:**

- `seat_no`: Seat identifier (e.g., "1A", "2B")
- `row`: Row position for grid layout
- `col`: Column position for grid layout
- `blocked`: Boolean indicating if seat is unavailable
- `path`: Boolean indicating walkway/aisle
- `facility`: String label for facility seats (e.g., "CR", "PWD")
- `renaming`: Optional custom seat label

#### 7. Seat Blocking Management

**Problem Solved:** Prevent double-booking by automatically blocking seats when passengers are added and unblocking when removed.

**Implementation:**

**Save Passenger - Seat Blocking:**

```javascript
if (editingIndex.value !== null) {
  // When editing, handle seat changes
  const oldSeat = passengers.value[editingIndex.value].seat;
  const newSeat = entry.seat;

  if (oldSeat !== newSeat) {
    // Unblock the old seat
    const oldSeatObj = availableSeats.value.find((s) => s.seat_no === oldSeat);
    if (oldSeatObj) {
      oldSeatObj.blocked = false;
    }

    // Block the new seat
    const newSeatObj = availableSeats.value.find((s) => s.seat_no === newSeat);
    if (newSeatObj) {
      newSeatObj.blocked = true;
    }
  }

  passengers.value[editingIndex.value] = entry;
} else {
  // When adding new passenger, block the selected seat
  const seatToBlock = availableSeats.value.find(
    (s) => s.seat_no === entry.seat,
  );
  if (seatToBlock) {
    seatToBlock.blocked = true;
  }

  passengers.value.push(entry);
}
```

**Remove Passenger - Seat Unblocking:**

```javascript
const removePassenger = (idx) => {
  // Unblock the seat before removing the passenger
  const passenger = passengers.value[idx];
  if (passenger && passenger.seat) {
    const seatToUnblock = availableSeats.value.find(
      (s) => s.seat_no === passenger.seat,
    );
    if (seatToUnblock) {
      seatToUnblock.blocked = false;
    }
  }

  passengers.value.splice(idx, 1);
};
```

**Edit Passenger - Seat Restoration:**

```javascript
const editPassengerFromModal = (passenger) => {
  const idx = passengers.value.findIndex(
    (p) => p.seat === passenger.seat && p.fullname === passenger.fullname,
  );

  if (idx !== -1) {
    // ... populate form fields ...

    // Set the selected seat for editing
    const seat = availableSeats.value.find((s) => s.seat_no === passenger.seat);
    if (seat) {
      selectedSeat.value = seat;
    }

    editingIndex.value = idx;
  }
};
```

**Benefits:**

- Real-time seat availability updates
- Visual feedback for seat status changes
- Prevents accidental double-booking
- Maintains seat state across accommodation switches
- Handles seat changes during passenger edits

#### 8. Selected Seat Information Display

**Feature:** Shows selected seat details in a highlighted info box below the seatmap.

**UI Component:**

```javascript
<div v-if="selectedSeat" class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
  <p class="text-sm font-medium text-blue-900">
    Selected Seat: <span class="font-bold">{{ selectedSeat.seat_no }}</span>
  </p>
</div>
```

**Legend Display:**

```javascript
<div class="flex gap-4 mt-4 text-xs justify-center">
  <div class="flex items-center gap-1">
    <div class="w-6 h-6 bg-gray-100 border rounded"></div>
    <span>Available</span>
  </div>
  <div class="flex items-center gap-1">
    <div class="w-6 h-6 bg-blue-600 rounded"></div>
    <span>Selected</span>
  </div>
  <div class="flex items-center gap-1">
    <div class="w-6 h-6 bg-gray-300 rounded"></div>
    <span>Path</span>
  </div>
  <div class="flex items-center gap-1">
    <div class="w-6 h-6 bg-red-700 rounded"></div>
    <span>Blocked</span>
  </div>
</div>
```

### Bug Fixes (Seatmap)

#### Issue 3: Seatmap Not Loading

**Symptom:** Seatmap fetch triggered but no data displayed
**Cause:** Alert dialog blocking watch execution and reactive updates
**Fix:** Removed blocking `alert()` calls, replaced with `console.log()` for debugging

#### Issue 4: Class Matching Failure

**Symptom:** "No class found matching Business Class" despite correct API response
**Cause:** Attempted to match by `accommodation_id` which doesn't exist in layout classes
**Fix:** Simplified matching to use only `cls.name === newAccommodation`

#### Issue 5: Seats Not Persisting Blocked State

**Symptom:** Switching accommodations would reset all seats to available
**Cause:** Fresh seat data loaded without checking existing passenger assignments
**Fix:** Added logic to re-block seats assigned to passengers after loading new seatmap data

---

## Schedule Management Module

### Overview

The Schedule Management Module (`ScheduleModule.vue` and `ModalScheduleOptions.vue`) provides comprehensive tools for managing ferry schedules across multiple routes.

### ScheduleModule.vue Features

#### 1. Route Display with Schedules

**Functionality:**

- Displays all routes with their associated schedules
- Shows both Port A and Port B schedules for each route
- Provides status indicators (Active/Inactive)

**Data Structure:**

```javascript
routes.value = [
  {
    route_id: 1,
    portA: {
      port_name: "Batangas Port",
      schedules: [...]
    },
    portB: {
      port_name: "Calapan Port",
      schedules: [...]
    },
    status: "active"
  }
]
```

#### 2. Filtering and Search

**Capabilities:**

- Filter by tab: All Routes, Active Schedules, Closed Routes
- Search by port name or route ID
- Real-time filtering with computed properties

**Implementation:**

```javascript
const filteredRoutes = computed(() => {
  let filtered = routes.value;

  // Tab filtering
  if (activeTab.value === "active")
    filtered = filtered.filter((r) => r.status === "active");
  else if (activeTab.value === "closed")
    filtered = filtered.filter((r) => r.status !== "active");

  // Search filtering
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter((r) => {
      return (
        r.portA?.port_name?.toLowerCase().includes(q) ||
        r.portB?.port_name?.toLowerCase().includes(q) ||
        r.route_id?.toString().includes(q)
      );
    });
  }

  return filtered;
});
```

#### 3. Summary Cards

**Metrics Displayed:**

- Total Schedules: Count of all schedules across all routes
- Active Schedules: Number of routes with active status
- Closed Schedules: Number of inactive or closed routes

**Computed Values:**

```javascript
const totalSchedules = computed(() =>
  routes.value.reduce(
    (sum, r) =>
      sum +
      (r.portA?.schedules?.length || 0) +
      (r.portB?.schedules?.length || 0),
    0,
  ),
);
```

#### 4. Route Management Actions

**Available Operations:**

- Create new schedules
- View schedule details
- Edit schedule options
- Manage schedule visibility (online/teller booking)

### ModalScheduleOptions.vue Features

#### 1. Bi-Directional Schedule View

**Layout:**

- Left Column: Schedule times (Departure/Arrival)
- Right Column: Options (Online/Teller availability)
- Separate sections for Port A and Port B schedules

#### 2. Schedule Options Management

**Toggleable Options:**

- **Online Booking:** Enable/disable schedule for online customers
- **Teller Booking:** Enable/disable schedule for teller station bookings

**UI Components:**

- Toggle switches for each schedule
- Visual status indicators
- Real-time updates

#### 3. Modal Design

**Features:**

- Full-width layout (max-w-4xl)
- Scrollable content area for long schedule lists
- Fixed header and footer for navigation
- Smooth open/close animations

### API Integration

#### Endpoints Used:

1. **GET** `/routes/with-schedules` - Fetch all routes with nested schedules
2. **GET** `/vessels` - Fetch vessel list for schedule assignment
3. **POST** `/schedules` - Create new schedule
4. **PUT** `/schedules/:id` - Update schedule details
5. **PATCH** `/schedules/:id/options` - Update schedule visibility options

#### Response Structure:

```javascript
{
  success: true,
  data: {
    routes: [
      {
        route_id: 1,
        portA: {
          id: 1,
          port_name: "Batangas Port",
          schedules: [
            {
              sched_id: 7,
              departure_time: "08:00:00",
              arrival_time: "10:30:00",
              vessel: { id: 1, name: "FCM15" },
              status: "active",
              visibility: 1
            }
          ]
        },
        portB: { ... }
      }
    ]
  }
}
```

---

## UI/UX Enhancements

### Animation and Transition System

#### 1. Modal Transitions

**Implementation:** Smooth fade-in/fade-out effects for all modals

**CSS Transitions:**

```vue
<transition
  enter-active-class="transition ease-out duration-200"
  enter-from-class="opacity-0"
  enter-to-class="opacity-100"
  leave-active-class="transition ease-in duration-150"
  leave-from-class="opacity-100"
  leave-to-class="opacity-0"
>
  <div class="modal-overlay">
    <div class="modal-card">
      <!-- Modal content -->
    </div>
  </div>
</transition>
```

**Features:**

- 200ms enter duration with ease-out timing
- 150ms leave duration with ease-in timing
- Opacity-based fade animations
- Staggered card entrance for modal content

#### 2. Modal Card Animation

**Effect:** Drop-down and scale-up entrance effect

**Classes Used:**

```css
.modal-card {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

#### 3. Dashboard Welcome Card

**Animation:** Drop-in effect on page load

**Timing:**

- Initial state: Translated up 20px with 0 opacity
- Animation duration: 500ms
- Timing function: ease-out
- Final state: Normal position with full opacity

#### 4. Login Card Animation

**Effect:** Smooth entrance on login page load

**Implementation:**

- Similar to dashboard card but with slightly different timing
- Creates a welcoming first impression
- Reduces perception of load time

#### 5. Sidebar Improvements

**Changes:**

- Fixed spacing between menu items
- Added relevant icons for each section:
  - Dashboard: Home icon
  - Schedules: Clock icon
  - Routes: Map icon
  - Vessels: Ship icon
  - Ports: Anchor icon
  - System: Settings icon
- Added "System" section in sidebar
- Improved visual hierarchy with consistent padding

**Icon Integration:**

```vue
<div class="sidebar-item">
  <ClockIcon class="w-5 h-5" />
  <span>Schedules</span>
</div>
```

### Payment Modal Enhancements

#### 1. Increased Modal Width

**Change:** Expanded from `max-w-xl` to `max-w-3xl` for better content display

**Benefit:**

- More space for payment method options
- Better visibility of payment method images
- Improved readability of payment instructions

#### 2. Payment Method Images

**Implementation:** Added visual payment method icons

**Asset Location:** `src/assets/payment-method-images/`

**Supported Methods:**

- Cash
- GCash
- Maya (PayMaya)
- Credit/Debit Card
- Bank Transfer

**Display Format:**

```vue
<div class="payment-option">
  <img 
    :src="paymentMethodImage" 
    :alt="paymentMethod"
    class="payment-icon"
  />
  <span>{{ paymentMethodName }}</span>
</div>
```

### Vessel Display Enhancement

#### No Vessel Label

**Problem:** Schedules without assigned vessels showed empty or undefined

**Solution:** Added "No vessel" placeholder text

**Implementation:**

```javascript
const vesselName =
  item.vessel?.vessel_name ??
  item.vessel?.name ??
  item.vessel_name ??
  (typeof item.vessel === "string" ? item.vessel : "");

return {
  code: vesselName || "No vessel",
};
```

**Display:**

- Active schedules with vessel: Show vessel name (e.g., "FCM15")
- Schedules without vessel: Show "No vessel" in gray text
- Makes it clear when vessel assignment is pending

### Grid Layout Fixes

#### Teller Booking Full-Width

**Change:** Updated grid layout to use full viewport width

**Before:** Constrained container with max-width
**After:** Full-width responsive grid

**CSS:**

```css
.booking-layout {
  grid-template-columns: 0.75fr 1.25fr;
  width: 100%;
}
```

**Benefits:**

- Better utilization of screen real estate
- More visible schedule buttons
- Improved passenger list display

---

## Authentication Feedback

### Login Success Flow

#### 1. Welcome Back Toast

**Trigger:** Successful login authentication

**Implementation:**

```javascript
// After successful login
localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));

// Redirect with success message
router.push({
  path: "/home",
  query: { loggedIn: "1" },
});
```

**Toast Display:**

```vue
<div v-if="showWelcomeToast" class="toast success">
  <CheckCircleIcon class="w-5 h-5" />
  <span>Welcome back, {{ userName }}!</span>
</div>
```

**Features:**

- Personalized greeting with user name
- Success icon (green check mark)
- Auto-dismiss after 3 seconds
- Smooth fade-in/fade-out animation

**Styling:**

```css
.toast.success {
  background: #10b981;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Logout Flow

#### 1. Signed Out Confirmation

**Trigger:** User clicks logout button

**Implementation:**

```javascript
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  router.push({
    path: "/",
    query: { loggedOut: "1" },
  });
};
```

**Toast Display:**

```vue
<div v-if="showLogoutToast" class="toast info">
  <InfoIcon class="w-5 h-5" />
  <span>You have been signed out</span>
</div>
```

**Features:**

- Clear confirmation message
- Info icon (blue)
- Auto-dismiss after 3 seconds
- Prevents confusion about logout status

#### 2. Session Security

**Enhancements:**

- Immediate token removal from localStorage
- Redirect to login page
- Clear all user session data
- Prevent back-button access to protected routes

### Toast System Architecture

#### Component Structure:

```vue
<transition name="toast">
  <div v-if="showToast" class="toast-container">
    <div :class="['toast', toastType]">
      <component :is="toastIcon" class="toast-icon" />
      <span class="toast-message">{{ toastMessage }}</span>
      <button @click="dismissToast" class="toast-close">×</button>
    </div>
  </div>
</transition>
```

#### Toast Types:

1. **Success** (Green) - Login success, booking complete
2. **Error** (Red) - Login failed, validation errors
3. **Warning** (Yellow) - Pending actions, confirmations
4. **Info** (Blue) - Logout, informational messages

#### Auto-Dismiss Logic:

```javascript
const showToast = (message, type = "info", duration = 3000) => {
  toastMessage.value = message;
  toastType.value = type;
  showToastFlag.value = true;

  setTimeout(() => {
    showToastFlag.value = false;
  }, duration);
};
```

#### Positioning:

- Fixed position in top-right corner
- Z-index: 9999 (above all other elements)
- Margin: 1.5rem from top and right edges
- Stacks vertically for multiple toasts

---

## Technical Improvements

### Code Organization

#### 1. Computed Properties

- Extensive use of Vue computed properties for reactive filtering
- Performance optimization through memoization
- Clean separation of data transformation logic

#### 2. Composable Patterns

- Reusable watch patterns for form state management
- Centralized API call functions
- Consistent error handling across components

#### 3. Type Safety Considerations

- Defensive null checking (`?.` optional chaining)
- Fallback values for undefined data
- Type coercion for API response handling

### Performance Optimizations

#### 1. Lazy Loading

- Modal components loaded only when needed
- Route-based code splitting
- Reduced initial bundle size

#### 2. Debounced Search

- Search queries debounced to reduce API calls
- Improved UX during typing
- Reduced server load

#### 3. Efficient Re-rendering

- V-for with unique keys (schedule IDs)
- Minimal DOM updates with Vue's reactive system
- Strategic use of v-show vs v-if

### Error Handling

#### 1. API Error Management

```javascript
try {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  // Process data
} catch (err) {
  console.error("API Error:", err);
  showToast("Failed to load data", "error");
}
```

#### 2. Fallback UI States

- Loading skeletons during data fetch
- Empty states for no results
- Error messages with retry options

#### 3. Token Expiry Handling

- Automatic redirect to login on 401/403
- Token refresh logic
- Session persistence validation

### API Integration Fixes

#### 1. Vessels Module Data Parsing

**Issue:** VesselsModule.vue was not displaying vessel data correctly after API changes.

**Root Cause:** API response structure changed from `name` to `vessel_name` field.

**Solution:**

```javascript
// Before
const mappedVessels = response.data.vessels.map((v) => ({
  ...v,
  name: v.name, // Would be undefined with new API
}));

// After
const mappedVessels = response.data.vessels.map((v) => ({
  ...v,
  name: v.vessel_name || v.name, // Fallback for backward compatibility
}));
```

**Benefits:**

- Vessels display correctly in vessel management dashboard
- Backward compatible with both API response formats
- Proper summary card calculations (total vessels, active, drydock)

#### 2. Accommodation Rates Endpoint

**Issue:** Rate fetching for teller booking used incorrect endpoint and response structure.

**Previous Implementation:**

```javascript
// Wrong endpoint
const response = await fetch(`${apiBase}/routes/rates`);

// Expected wrong structure
const rates = response.data.rates;
```

**Corrected Implementation:**

```javascript
// Correct endpoint
const response = await fetch(`${apiBase}/accommodation-rates/route/${routeId}`);

// Parse correct structure
const result = await response.json();
const rates = result.data?.accRates || [];

// Map to match accommodation names
const matchedRate = rates.find(
  (r) => r.accommodation.accommodation_name === selectedAccommodation.value,
);
const baseRate = matchedRate?.base_rate || 0;
```

**Response Structure:**

```json
{
  "success": true,
  "data": {
    "accRates": [
      {
        "accommodation": {
          "accommodation_name": "Business Class",
          "accommodation_id": 1
        },
        "base_rate": 250.0
      }
    ]
  }
}
```

**Benefits:**

- Accurate rate calculations based on selected accommodation
- Dynamic pricing based on route-specific rates
- Proper discount calculations from correct base rate

#### 3. Vessel Layout API Integration

**Challenge:** Integrating vessel seatmap data from vessel management module into teller booking.

**API Endpoint:** `GET /vessels/{vesselId}/layout`

**Response Parsing:**

```javascript
// Response structure
{
  "name": "FCM15",
  "status": "active",
  "classes": [
    {
      "name": "Business Class",
      "rows": 5,
      "columns": 8,
      "seats": [
        {
          "seat_no": "1A",
          "row": 0,
          "col": 0,
          "blocked": false,
          "path": false,
          "facility": null
        }
      ]
    }
  ]
}

// Class matching logic
const selectedClass = classes.find(cls => cls.name === selectedAccommodation.value);
if (selectedClass) {
  availableSeats.value = selectedClass.seats || [];
}
```

**Key Learning:**

- Class matching should use `name` field, not `accommodation_id`
- API returns class-specific seat layouts, not a flat list
- Each class can have different seating configurations

---

## Future Enhancements (Recommended)

### 1. Teller Booking

- [ ] Real-time seat availability checking
- [ ] Passenger data auto-fill from previous bookings
- [ ] Print ticket preview before payment
- [ ] Booking history and amendments
- [ ] Multi-passenger quick booking

### 2. Schedule Management

- [ ] Drag-and-drop schedule reordering
- [ ] Bulk schedule operations
- [ ] Schedule templates for recurring routes
- [ ] Capacity management per schedule
- [ ] Weather-based schedule alerts

### 3. UI/UX

- [ ] Dark mode support
- [ ] Keyboard shortcuts for common actions
- [ ] Accessibility improvements (ARIA labels, screen reader)
- [ ] Mobile responsive design for tablets
- [ ] Progressive Web App (PWA) capabilities

### 4. Analytics

- [ ] Booking statistics dashboard
- [ ] Route popularity metrics
- [ ] Revenue reports per route/schedule
- [ ] Vessel utilization tracking
- [ ] Peak time analysis

---

## Conclusion

The FCBook Frontend has undergone significant improvements focusing on user experience, visual polish, and functional enhancements. The route-based booking system provides a more intuitive workflow for tellers, while the enhanced schedule management module offers comprehensive tools for administrators. The addition of smooth animations and clear feedback mechanisms creates a modern, professional application that improves operational efficiency.

### Key Achievements:

✅ Intuitive route-based schedule selection
✅ Bi-directional schedule display with clear separation
✅ Enhanced visual feedback and animations
✅ Comprehensive schedule management tools
✅ Improved authentication feedback
✅ Better error handling and user guidance

### Testing Recommendations:

1. Test schedule selection across all routes
2. Verify return trip toggle functionality
3. Confirm toast notifications display correctly
4. Check modal transitions on various browsers
5. Validate API error handling scenarios
6. Test with different user roles and permissions

---

**Document Version:** 1.0  
**Last Updated:** February 20, 2026  
**Author:** Development Team
