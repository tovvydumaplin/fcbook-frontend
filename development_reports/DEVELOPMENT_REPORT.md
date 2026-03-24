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

### Institutional Account Integration

#### 9. Institutional Account Selection Modal

**Feature Overview:**
Added institutional account selection capability to the teller booking module. When a teller selects "Institutional Account" as the passenger type, a modal opens displaying all available institutional accounts with their logos and names.

**Implementation:**

**Modal Component (`IaModal.vue`):**

- Grid layout displaying institutional accounts with logos
- Search functionality to filter accounts by name
- Loading states during API fetch
- Visual selection indicators
- Confirmation workflow before applying selection

**API Integration:**

```javascript
// Fetch institutional accounts
const response = await fetch(`${apiBase}/institutional-accounts`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

// Response structure
{
  success: true,
  status: 200,
  message: "Institutional accounts retrieved successfully",
  data: {
    institutional_accounts: [
      {
        ia_id: 1,
        ia_name: "Philtranco",
        ia_image: "seeders/images/philtranco.jpg"
      }
    ]
  }
}
```

**User Flow:**

1. **Trigger:** Teller selects "Institutional Account" from passenger type options
2. **Modal Opens:** Displays grid of available institutional accounts
3. **Search:** Teller can search by account name to filter results
4. **Selection:** Click on an account card to select it (shows blue border and checkmark)
5. **Confirmation:** Click "Confirm Selection" button to apply
6. **Display:** Selected account shows in a blue info box with logo and "Change" button
7. **Booking:** Selected IA information is included in the passenger entry

**Visual Design:**

```vue
<!-- Selected IA Display -->
<div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
  <div class="flex items-center gap-3">
    <div class="w-12 h-12 rounded-lg overflow-hidden bg-white">
      <img :src="ia.ia_image" :alt="ia.ia_name" />
    </div>
    <div class="flex-1">
      <p class="text-xs text-gray-600 font-medium">Selected Institution</p>
      <p class="text-sm font-bold text-blue-900">{{ ia.ia_name }}</p>
    </div>
    <button class="text-blue-600 hover:text-blue-800">Change</button>
  </div>
</div>
```

**Data Storage:**

- Selected IA stored in `selectedInstitutionalAccount` ref
- Included in passenger entry as `institutionalAccount` property
- Cleared on form reset and after successful booking
- Persists through accommodation and seat selection

**Features:**

- **Responsive Grid:** 2-3 columns depending on screen size
- **Image Fallback:** Shows first letter of account name if no logo
- **Search Filter:** Real-time filtering by account name
- **Loading State:** Spinner and message during API fetch
- **Empty State:** Clear message when no accounts found
- **Selection Indicator:** Blue border, background, and checkmark icon
- **Change Option:** Can reopen modal to change selection without restarting flow

**Benefits:**

- Streamlined booking process for institutional passengers
- Visual account recognition with logos
- Search capability for quick account location
- Clear feedback on current selection
- Maintains selection through multi-step booking process
- Reduces manual data entry errors

**Integration Points:**

- Triggered by `watch(selectedType)` when value is "Institutional Account"
- Modal state managed by `isIaModalOpen` ref
- Selection handler: `handleIaSelect(ia)`
- Reset in `bookEntry()` and `resetForm()` functions

**Future Enhancements:**

- [ ] Auto-apply institutional discounts based on selected account
- [ ] Display discount eligibility in the IA selection modal
- [ ] Show account balance or credit limit
- [ ] Pre-fill passenger details for frequent institutional travelers
- [ ] Bulk booking for multiple IA passengers

#### 10. Vehicle Selection Preview Display

**Feature Overview:**
Added a visual preview display for selected vehicles in the Driver category, similar to the institutional account display. Shows vehicle details with the ability to change selection.

**Implementation:**

**Visual Display:**

```vue
<!-- Selected Vehicle Display -->
<div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
  <div class="flex items-center gap-3">
    <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
      <svg class="w-7 h-7 text-blue-600"><!-- Vehicle icon --></svg>
    </div>
    <div class="flex-1">
      <p class="text-xs text-gray-600 font-medium">Selected Vehicle</p>
      <p class="text-sm font-bold text-blue-900">
        {{ vehicleType }} - {{ vehicleBrand }}
      </p>
      <p class="text-xs text-gray-600 mt-0.5">Plate: {{ plateNumber }}</p>
    </div>
    <button class="text-blue-600 hover:text-blue-800">Change</button>
  </div>
</div>
```

**Display Conditions:**

- Shows when `selectedCategory === 'Driver'`
- Only appears after vehicle selection is confirmed
- Displays vehicle type, brand, and plate number
- Blue color scheme matching IA display for consistency

**Features:**

- **Vehicle Icon:** Lightning bolt icon representing vehicle/speed
- **Type Display:** Converts camelCase to readable format (e.g., "lightcar" → "Light Car")
- **Brand Display:** Shows selected vehicle brand
- **Plate Number:** Displays plate if provided (bicycles don't require plates)
- **Change Button:** Reopens vehicle selection modal
- **Blue Theme:** Consistent with institutional account display

**User Experience:**

1. Teller selects "Driver" category → Vehicle modal opens
2. Select vehicle type, brand, and enter plate number
3. Confirm selection
4. Blue preview box appears showing vehicle details
5. Can click "Change" to modify selection anytime
6. Vehicle info saved with passenger booking

**Benefits:**

- Clear visual confirmation of selected vehicle
- Easy to verify details before finalizing booking
- Quick access to change selection if mistake made
- Consistent UI pattern with IA display
- Reduces cognitive load by showing summary

**Styling Details:**

- Background: `bg-blue-50` with `border-blue-200`
- Icon background: `bg-blue-100` with blue vehicle icon
- Text colors: Blue for emphasis, gray for labels
- Hover states on "Change" button
- Compact layout matching IA display

#### 11. Passenger Type Selection Modal

**Feature Overview:**
Added a passenger type selection modal that opens when "Regular Passenger" is selected. The modal fetches and displays available passenger types from the API, showing their discounts and benefits.

**Implementation:**

**Modal Component (`PassengerTypeModal.vue`):**

- List layout displaying passenger types with details
- Search functionality to filter types by name
- Shows discount percentages and fee waiver status
- Loading states during API fetch
- Visual selection indicators
- Filters out "Institutional Account" type (handled separately)

**API Integration:**

```javascript
// Fetch passenger types
const response = await fetch(`${apiBase}/passenger-types`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

// Response structure
{
  success: true,
  status: 200,
  message: "Passenger types retrieved successfully.",
  data: {
    types: [
      {
        p_id: 1,
        type: "regular passenger",
        discount: "0.00",
        waived: false,
        status: "active"
      },
      {
        p_id: 3,
        type: "Student",
        discount: "0.10",
        waived: false,
        status: "active"
      }
    ]
  }
}
```

**User Flow:**

1. **Trigger:** Teller selects "Regular Passenger" from passenger type options
2. **Modal Opens:** Displays list of available passenger types
3. **Search:** Teller can search by type name to filter results
4. **Selection:** Click on a type card to select it (shows blue border and checkmark)
5. **Discount Display:** Shows discount percentage and fee waiver status for each type
6. **Confirmation:** Click "Confirm Selection" button to apply
7. **Display:** Selected type shows in a blue info box with discount details and "Change" button
8. **Booking:** Selected type information and discount applied to passenger entry

**Visual Design:**

```vue
<!-- Selected Passenger Type Display -->
<div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
  <div class="flex items-center gap-3">
    <div class="w-12 h-12 rounded-lg bg-blue-100">
      <svg class="w-6 h-6 text-blue-600"><!-- User icon --></svg>
    </div>
    <div class="flex-1">
      <p class="text-xs text-gray-600 font-medium">Selected Passenger Type</p>
      <p class="text-sm font-bold text-blue-900">{{ type.type }}</p>
      <span class="text-xs text-green-600 font-medium">
        {{ discount }}% Discount
      </span>
    </div>
    <button class="text-blue-600 hover:text-blue-800">Change</button>
  </div>
</div>
```

**Type Card Features:**

- **User Icon:** Person icon representing passenger
- **Type Name:** Capitalized display of passenger type
- **Discount Badge:** Green text showing percentage (e.g., "10% Discount")
- **Fee Waived Badge:** Orange text when applicable
- **Status Filter:** Only shows active types
- **Selection Indicator:** Blue border, background, and checkmark

**Discount Application:**

- Passenger type discount stored in `selectedPassengerTypeDetails`
- Discount percentage parsed from type.discount field (e.g., "0.10" = 10%)
- Applied during fare calculation
- Displayed in passenger entry summary
- Can be combined with other discounts based on business rules

**Features:**

- **Responsive List:** Full-width stacked cards for easy selection
- **Search Filter:** Real-time filtering by type name
- **Loading State:** Spinner and message during API fetch
- **Empty State:** Clear message when no types found
- **Selection Indicator:** Blue border, background, and checkmark icon
- **Discount Visibility:** Shows discount percentage prominently
- **Fee Waiver Indicator:** Orange badge when fees are waived
- **Change Option:** Can reopen modal to change selection

**Benefits:**

- Clear display of available passenger types and their benefits
- Visual discount information helps tellers provide accurate pricing
- Search capability for quick type location
- Maintains selection through multi-step booking process
- Consistent UI with IA and Vehicle selection modals
- Automatic discount application based on passenger type

**Integration Points:**

- Triggered by `watch(selectedType)` when value is "Regular Passenger"
- Modal state managed by `isPassengerTypeModalOpen` ref
- Selection handler: `handlePassengerTypeSelect(type)`
- Discount applied in fare calculation
- Reset in `bookEntry()` and `resetForm()` functions

**Data Storage:**

- Selected type stored in `selectedPassengerTypeDetails` ref
- Included in passenger entry as `passengerTypeDetails` property
- Contains: p_id, type, discount, waived, status
- Cleared on form reset and after successful booking
- Persists through accommodation and seat selection

#### 12. Vehicle Selection Modal Redesign

**Feature Overview:**
Redesigned the vehicle selection modal to match the modern design pattern of the institutional account and passenger type modals. Now fetches vehicle data from the API instead of using static data, with automatic categorization by vehicle type in a clean tabbed interface.

**Implementation:**

**API Integration:**

```javascript
// Fetch vehicles from API
const response = await fetch(`${apiBase}/vehicles`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

// Response structure
{
  status: 200,
  success: true,
  message: "Vehicles retrieved successfully",
  data: {
    vehicles: [
      {
        vehicle_id: 1,
        vehicle_type: 1,
        vehicle_class: "Bicycle",
        created_at: "2026-03-02T15:35:10.000000Z",
        updated_at: "2026-03-02T15:35:10.000000Z",
        deleted_at: null
      }
    ]
  }
}
```

**Simple One-Step Selection:**

1. **Tabbed Interface:** Displays vehicle types (Type 1, Type 2, Type 3, etc.) as tabs
2. **Vehicle Grid:** Shows vehicle classes under each tab
3. **Search Functionality:** Filter vehicle classes within the active tab
4. **Select & Confirm:** Click vehicle → Click "Confirm Selection" button

**Vehicle Type Categorization:**

Vehicles are automatically grouped by their `vehicle_type` value from the API:

- Type 1: Two-wheeled vehicles (Bicycle, Bicycle with side car, etc.)
- Type 2: Light & medium vehicles (Van, Pickup, Forward, etc.)
- Type 3+: Additional vehicle categories as defined in the system

The modal displays tabs for each vehicle type present in the API response, making it easy to browse by category.

**Visual Design:**

- Clean header with selected vehicle indicator
- Tabbed interface for vehicle types (Type 1, Type 2, Type 3, etc.)
- Vehicle classes displayed in grid under active tab with icons
- Selected vehicle highlighted with blue border and checkmark
- Search bar with real-time filtering within active type
- Card-based selection with hover effects
- Loading spinner during API fetch
- Empty state for no results
- Cancel and Confirm buttons in footer
- Blue theme matching other modals

**Features:**

- **API-Driven Data:** Fetches real vehicle classes from backend
- **Tabbed Categorization:** Displays tabs for each vehicle type with automatic grouping
- **Single-Step Selection:** Simple click-and-confirm workflow
- **Search Capability:** Filter vehicle classes within the active type tab
- **Visual Feedback:** Selected vehicle shows blue border, background, and checkmark
- **Consistent UI:** Matches design pattern of IA and passenger type modals

**Benefits:**

- Centralized vehicle data management via API
- Cleaner, more intuitive single-step selection process
- Better organization with automatic categorization by type
- Consistent user experience across all selection modals
- Reduced maintenance with dynamic data loading
- Faster workflow without unnecessary details

**Data Structure:**

```javascript
// Saved vehicle data
{
  vehicle_id: 1,
  vehicle_class: "Bicycle",
  vehicle_type: 1
}
```

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
