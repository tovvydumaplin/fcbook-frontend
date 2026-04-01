# Development Report - feature/vessels-v2

**Branch:** `feature/vessels-v2`
**Date:** March 31, 2026
**Author:** yurimarine

---

## Summary

This development cycle focused on enhancing the vessel management system with two major components:

1. **UI/UX improvements to the Schedule Module** - Enhanced table presentation with additional data columns
2. **Vessel accommodation and seating system refactor** - Created new modal components for managing vessel accommodations and block seats

---

## Commits Overview

### Total Changes

- **2 commits** since `master`
- **5 files modified/created**
- **1,466 insertions, 563 deletions**

---

## Detailed Changes

### Commit 1: `ae24b62` - "minimal changes to schedule module design"

**File Modified:** `src/views/ScheduleModule.vue`

#### Overview

Updated the schedule display table layout to accommodate an additional column for showing arrival times alongside departure times. Enhanced typography and alignment for better readability.

#### Specific Changes

**1. Table Header Colspan Update (Line 438, 537)**

- Changed `:colspan` from `3` to `4` for both Port A and Port B section headers
- **Reason:** Added a new column (Arrival time), requiring header to span additional column

**2. Column Header Styling Improvements (Line 446-464)**

- **Departure Column:**
  - Class: `w-30 px-4 py-2 text-xs text-gray-500 text-left` → `w-20 px-4 py-2 text-sm text-gray-600 text-center`
  - Changes: Reduced width (w-30 → w-20), increased font size (text-xs → text-sm), changed text color (text-gray-500 → text-gray-600), centered alignment (text-left → text-center)

- **New Arrival Column (inserted):**
  - Class: `w-20 px-4 py-2 text-sm text-gray-600 text-center border-l border-r border-t border-b border-gray-200`
  - New column displays arrival times with consistent styling to departure column

- **Vessel Column:**
  - Class: `w-50 px-4 py-2 text-xs text-gray-500 text-center` → `w-40 px-4 py-2 text-sm text-gray-600 text-center`
  - Changes: Reduced width (w-50 → w-40), increased font size, updated text color, centered alignment

- **Status Column:**
  - Class: `w-30 px-4 py-2 text-xs text-gray-500 text-left` → `w-30 px-4 py-2 text-sm text-gray-600 text-center`
  - Changes: Increased font size, updated text color, centered alignment

**3. Table Row Styling (Line 467, 472-480)**

- Added `class="text-center"` to table rows for Port A schedules
- New table data cell for `arrival_time`:
  ```vue
  <td
    class="px-4 py-2 text-sm border-l border-r border-t border-b border-gray-200"
  >
    {{ sched.arrival_time }}
  </td>
  ```

**4. Port B Section Updates (Line 537-577)**

- Applied identical changes to Port B schedule section:
  - Updated colspan from 3 to 4
  - Updated all column headers with new styling
  - Added arrival time column
  - Added `text-center` class to rows

#### Visual Impact

- **Before:** Schedule table showed Departure | Vessel | Status columns only
- **After:** Schedule table now shows Departure | Arrival | Vessel | Status columns with improved typography
- Consistent text sizing and centering improves visual hierarchy and readability

---

### Commit 2: `f06f187` - "Creation of Modal Block Seats and Vessel Accommodations -> Modifications to Vessels Module and Modal Seatmap due to changes and addition of other modals"

**Files Created:** 2
**Files Modified:** 2

#### Overview

This commit introduces a modular refactor of the vessel seating system, separating concerns into dedicated modal components for accommodation management and block seat configuration. This reduces code duplication and improves maintainability.

---

#### File 1: `src/components/Modals/Vessel/ModalVesselAccommodation.vue` (NEW)

**Purpose:** Manage vessel accommodations with display of amenities and seat distribution.

**Key Components:**

1. **Props & Emits**
   - Props: `vessel` (Object, required)
   - Emits: `close`, `saved`

2. **State Management**

   ```javascript
   - isSaving: Boolean (save operation status)
   - isPreviewLoading: Boolean (seatmap preview loading state)
   - isAddingOpen: Boolean (add accommodation dropdown state)
   - errorMsg: String (error messages)
   - selectedNewAccommodation: Object (currently selected accommodation to add)
   - availableAccommodations: Array (list of accommodations available to add)
   - vesselAccommodations: Array (list of accommodations assigned to vessel)
   - selectedAccommodation: Object (currently viewing/editing)
   - seatmapPreview: Object (preview of seatmap layout)
   ```

3. **Computed Properties**
   - `availableToAdd`: Filters accommodations not yet added to vessel

4. **Core Functionality**

   **Initialization:**
   - `initAccommodations()`: Maps vessel classes to accommodation objects with properties:
     - id, name, aircon, wifi, rows, columns, seats, facilityLabels

   **Facility Label Generation:**
   - `recomputeFacilityLabels(seats)`: Analyzes seat data to generate labels for facility areas
     - Creates bounding boxes for grouped facilities
     - Returns array of facility labels with calculated positions and dimensions

   **Accommodation Management:**
   - Add new accommodations to vessel
   - Remove accommodations with confirmation
   - Update accommodation properties (aircon, wifi)
   - Preview seatmap layout for selected accommodation

   **API Integration:**
   - Fetch available accommodations from API
   - Fetch seatmap preview for selected accommodation
   - Save accommodation changes back to server

5. **UI Elements**
   - Tabbed interface for viewing added accommodations
   - Amenity badges (Air Conditioning, WiFi icons)
   - Add accommodation dropdown with search
   - Seatmap preview with seat grid visualization
   - Delete accommodation button with confirmation

---

#### File 2: `src/components/Modals/Vessel/Seatmap/ModalBlockSeats.vue` (NEW)

**Purpose:** Manage individual block seat assignments and drag-based seat selection.

**Key Components:**

1. **Props & Emits**
   - Props: `vessel` (Object, required)
   - Emits: `close`, `saved`

2. **State Management**

   ```javascript
   - isLoading: Boolean (data fetch state)
   - isSaving: Boolean (save operation state)
   - errorMsg: String (error messages)
   - classes: Array (accommodation classes for vessel)
   - currentClass: Object (currently editing class)
   - isDragging: Boolean (drag operation active)
   - dragStart: Object (drag start coordinates {row, col})
   - wasDragging: Boolean (track if drag occurred)
   - seatSize: Number (44px - size of each seat in grid)
   ```

3. **Core Functionality**

   **Layout Fetching:**
   - `fetchLayout()`: Loads vessel class and seat data from API
     - Populates classes array with accommodation layouts
     - Returns seat grid data

   **Facility Label System:**
   - `recomputeFacilityLabels(seats)`: Identical to ModalVesselAccommodation
     - Groups seats by facility type
     - Calculates bounding box (top, left, width, height) for each facility area

   **Drag Selection:**
   - `onMouseDown()`: Initiates drag selection from seat grid
   - `onMouseMove()`: Tracks drag path and highlights seats
   - `onMouseUp()`: Completes selection and applies facility/block assignment
   - `wasDragging` flag prevents accidental seat clicks during drag operations

   **Seat Management:**
   - Select individual seats with click
   - Drag to select multiple seats in rectangle pattern
   - Assign facility type to selected seats
   - Remove facility assignments
   - Clear all selections

   **API Integration:**
   - Fetch current layout and seat assignments
   - Save modified seat configurations back to server
   - Handle API errors gracefully

---

#### File 3: `src/components/Modals/Vessel/Seatmap/ModalCreateSeatmap.vue` (MODIFIED)

**Changes Made:** Significant refactor - 863 insertions, 300 deletions

**Key Modifications:**

1. **Prop Signature Update**

   **Before:**

   ```javascript
   const props = defineProps({
     seatmap: Object,
     vesselId: [Number, String],
   });
   ```

   **After:**

   ```javascript
   const props = defineProps({
     vesselId: { type: [Number, String], required: true },
     accommodations: { type: Array, default: () => [] },
     seatmap: { type: Array, default: () => [] },
   });
   ```

   **Reason:** More explicit prop typing and added accommodations array for initialization fallback

2. **State Management Cleanup**
   - Removed: `isOpen`, `selectedClassIndex`, `isSeatmapLoading`
   - Reasoning: These were only used for old dropdown-based class selection

3. **Initialization Logic Refactor**

   **Before:** Direct object initialization at module level

   ```javascript
   if (props.seatmap?.length) {
     addedClasses.value = props.seatmap.map((cls) => ({...}));
   }
   ```

   **After:** Encapsulated in `initClasses()` function

   ```javascript
   const initClasses = () => {
     if (props.seatmap?.length) {
       // Initialize from existing seatmap
     } else if (props.accommodations?.length) {
       // Fallback: Initialize from accommodations list
     }
   };
   ```

   **Benefit:**
   - Better separation of concerns
   - Can be called on mount or when props change
   - Handles both existing seatmaps and new accommodations

4. **Facility Labels Enhancement**
   - Added `recomputeFacilityLabels()` function (same as new modals)
   - Now called during initialization to populate facility labels
   - Previously facility labels were not recomputed automatically

5. **Seat Size Update**
   - Changed from `40` to `44` pixels
   - Reason: Slightly larger, more usable seats in grid

6. **Class Selection Flow**
   - Simplified `selectClass()` function
   - Removed complex dropdown-based selection
   - More direct class switching without intermediate states

---

#### File 4: `src/views/VesselsModule.vue` (MODIFIED)

**Changes Made:** 162 insertions, 162 deletions (significant restructuring)

**Key Modifications:**

1. **Import Updates**
   - Added icon: `Armchair` (from lucide-vue-next) for accommodation button
   - Added components:
     - `ModalVesselAccommodation`
     - `ModalBlockSeats`

2. **State Variables Added**

   ```javascript
   - isAccommodationModalOpen: Boolean
   - isBlockSeatsModalOpen: Boolean
   - blockSeatsVessel: Object (vessel for block seats modal)
   - selectedVessel: Object (vessel for accommodation modal)
   ```

3. **Modal Event Handlers Added**

   ```javascript
   - openAccommodationModal(vessel): Opens accommodation management modal
   - handleAccommodationSaved(): Closes modal and refreshes vessel list
   - openBlockSeatsModal(vessel): Opens block seats editor
   - handleBlockSeatsSaved(): Closes modal and refreshes vessel list
   - handleSeatmapSave(): Closes seatmap modal and refreshes vessel list (modified existing function)
   ```

4. **Data Transformation Enhancement**
   - In `fetchVessels()` function, added accommodation ID to class mapping:

   **Before:**

   ```javascript
   classes: (v.accommodations || []).map((a) => ({
     accommodationName: a.accommodation?.accommodation_name || "Unknown",
     rows: a.rows || 0,
     ...
   }))
   ```

   **After:**

   ```javascript
   classes: (v.accommodations || []).map((a) => ({
     accommodationId: a.accommodation?.accommodation_id || "Unknown",
     accommodationName: a.accommodation?.accommodation_name || "Unknown",
     rows: a.rows || 0,
     ...
   }))
   ```

   **Reason:** Track accommodation ID for linking to ModalVesselAccommodation

5. **Code Organization**
   - Removed comment blocks ("// Helpers", "// API", etc.)
   - Reorganized function order for logical flow:
     - Modal handlers grouped together
     - Computed properties (activeVesselsCount, drydockVesselsCount) moved before filteredVessels
   - Removed commented-out code

6. **Computed Properties Added/Reorganized**
   - `activeVesselsCount`: Calculates count of vessels with status = 1
   - `drydockVesselsCount`: Calculates count of vessels with status = 2
     - Moved above `filteredVessels` for dependency clarity

7. **Integration Points**
   - Added corresponding modal instances in template (not shown in diff excerpt)
   - Modal buttons trigger new handlers for accommodation and block seats management
   - Modals receive vessel objects as props

---

## Technical Improvements

### Code Organization

- **Separation of Concerns:** Split monolithic seatmap/accommodation logic into dedicated components
- **Reusable Functions:** `recomputeFacilityLabels()` standardized across components
- **Cleaner Module:** Removed unused state and comments from VesselsModule

### UI/UX

- **More Columns:** Schedule now shows arrival times for better trip information
- **Better Typography:** Consistent font sizing and centering in tables
- **Modular Interfaces:** Three dedicated modals for different vessel management tasks

### Data Flow

- **Proper Prop Typing:** Explicit type definitions with defaults in ModalCreateSeatmap
- **Event Propagation:** Modal saves trigger vessel list refresh
- **Accommodation Tracking:** Now tracks accommodation IDs for better data correlation

---

## Files Summary

| File                           | Type     | Changes    | Purpose                                                     |
| ------------------------------ | -------- | ---------- | ----------------------------------------------------------- |
| `ScheduleModule.vue`           | Modified | +33, -8    | Added arrival time column, improved typography              |
| `ModalVesselAccommodation.vue` | Created  | +546       | Manage vessel accommodations and amenities                  |
| `ModalBlockSeats.vue`          | Created  | +458       | Manage individual seat blocks and assignments               |
| `ModalCreateSeatmap.vue`       | Modified | +863, -563 | Refactored for multi-modal support, improved initialization |
| `VesselsModule.vue`            | Modified | +162, -162 | Integrated new modals, added handlers                       |

---

## Testing Recommendations

1. **Schedule Module**
   - Verify arrival time displays correctly for both Port A and Port B
   - Confirm table alignment and typography looks consistent
   - Test with long vessel names to ensure column sizing

2. **Accommodation Modal**
   - Test adding/removing accommodations
   - Verify seatmap preview loads and displays
   - Confirm amenity icons (AC, WiFi) display correctly
   - Test error handling for API failures

3. **Block Seats Modal**
   - Test drag selection of seat ranges
   - Verify facility assignment to selected seats
   - Test individual seat clicking vs. drag selection
   - Confirm all seat data saves correctly

4. **Seatmap Modal**
   - Verify refactored initialization works with existing seatmaps
   - Test fallback initialization from accommodations
   - Ensure facility labels display correctly

5. **Integration**
   - Verify vessel list refreshes after modal saves
   - Test with various vessel types and accommodation counts
   - Confirm modals close cleanly and state resets

---

## Future Considerations

- Consider extracting shared utility functions (e.g., `recomputeFacilityLabels`) to a composable
- Monitor performance with large numbers of seats in seatmap
- Evaluate need for pagination or virtualization if vessel lists grow
- Consider undo/redo functionality for seat mapping changes
