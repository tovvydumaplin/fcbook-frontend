# DEVELOPMENT REPORT: refactor-structure-v2

- **Branch:** refactor-structure-v2
- **Base Branch:** master
- **Date:** 2026-03-30
- **Total Commits:** 12
- **Files Modified:** 24
- **Code Changes:** +1,898 insertions, -1,222 deletions

---

## COMMIT SUMMARY

1. Small changes to design due to change in status variable
2. Optimization to schedule module due to addition of edit modal, API fetch request, status variable, and removal of redundant code
3. Changes to vessels and modal seatmap functions → updates to vessel routes module due to status variable change
4. Changes to port router
5. Separation of edit and create function into modal → created modal edit schedule
6. Added status design to IA and merchant discount
7. Clean code
8. Clean code
9. Added uploading of image/logo to IA and Merchants
10. Removed redundant part in port and updated variable names in promo
11. Changes to file name of Port and router updates

---

## DETAILED FILE CHANGES

### 1. SCHEDULE MODULE REFACTORING

#### `ModalEditSchedule.vue` _(NEW FILE - 267 lines)_

- New component extracted from `ModalCreateSchedule` for editing schedules
- Features:
  - Reactive schedule row management
  - API fetch utility for CRUD operations
- Uses `watch()` to rebuild schedule rows when route prop changes
- Methods:
  - `addRow()`
  - `saveSchedule()` (PUT/POST logic)
- Handles Port A and Port B schedules separately

---

#### `ModalCreateSchedule.vue` _(227 → simplified)_

- Removed:
  - `mode` prop
  - Edit functionality
  - Complex props (`selectedRouteId`, `portASchedules`, `portBSchedules`)
  - Build logic for existing rows
  - `isSyncingFromRoute` state
  - Vessel field in rows
- Retained:
  - Basic route selection
  - New schedule creation

---

#### `ScheduleModule.vue` _(864 → 267 lines)_

- Added:
  - `ModalEditSchedule` import
  - `isEditScheduleModalOpen` ref
  - Centralized `apiFetch()` utility
- Removed:
  - `modalMode`, `modalRouteId`, `modalPortASchedules`, `modalPortBSchedules`
  - `normalizeRouteStatus()`
  - `getRouteStatus()`
- Updated:
  - Tab name: **"Active Schedules" → "Active Route"**
  - Filtering now uses `is_active` (boolean) instead of `status` (string)

---

### 2. MODAL COMPONENTS – IMAGE UPLOAD & STATUS

#### `ModalCreateIA.vue` _(+220 lines)_

- Added image/logo upload
- Added status design & display
- Improved form validation
- Enhanced UI for preview

#### `ModalEditIA.vue` _(+224 lines)_

- Mirrors Create IA
- Added image update/replace
- Added status field

---

#### `ModalCreateMerchant.vue` _(+136 lines)_

- Added logo upload
- Added status field
- Improved form

#### `ModalEditMerchant.vue` _(+141 lines)_

- Mirrors Create Merchant
- Added logo update
- Added status management

---

#### `ModalIADiscounts.vue` _(+22 lines)_

- Added status design elements

#### `ModalMerchantDiscounts.vue` _(+16 lines)_

- Added status design

---

### 3. SEATMAP & VESSEL OPTIMIZATIONS

#### `ModalCreateSeatmap.vue` _(~597 lines refactored)_

- Consolidated multiple modes into `activeMode`:
  - `pwdMode`, `renameMode`, `blockMode`, `pathMode`, `facilityMode`
- Added:
  - Lucide icons
  - `vesselId` prop
  - `errorMsg` for handling errors
- Refactored:
  - `openAddClass()` (removed async fetch)
- Enhanced:
  - Class properties (aircon, wifi)
  - Facility management with `removeFacilityBySeat()`

---

#### `VesselsModule.vue` _(~255 lines refactored)_

- Updated seatmap modal integration
- Adjusted for new status variable
- Removed redundant seatmap logic

---

### 4. FILE ORGANIZATION & ROUTING

#### Renamed

- `Port.vue` → `PortModule.vue`

#### Changes

- Standardized module naming convention
- Updated all imports
- Removed `ModalViewPort.vue` (-15 lines)

---

#### `router/index.js` _(+6 lines)_

- Updated route references
- Adjusted imports

---

### 5. RATES MODULE UPDATES

#### `PassengerTypesModule.vue` _(+18 lines)_

- Integrated new status variable
- Improved passenger type management

---

#### `AccommodationRatesComponent.vue` _(+19 lines)_

- Added status handling
- Improved consistency

---

#### `VehicleRatesComponent.vue` _(+19 lines)_

- Added vehicle rate status
- Improved display logic

---

### 6. NAVIGATION & DETAILS

#### `RoutesModule.vue` _(+20 lines)_

- Updated route filtering
- Added schedule status tracking

---

#### `ModalScheduleOptions.vue` _(+32 lines)_

- Updated for new status pattern
- Improved UI

---

#### Minor Updates

- `IADetailsComponent.vue` (+1 line) → Added status
- `MerchantDetailsComponent.vue` (+1 line) → Added status
- `ModalCreatePromo.vue` (-3 lines) → Cleanup
- `ModalCreateVessel.vue` (-4 lines) → Consistency fixes
- `sideBar.vue` (+2 lines) → Navigation update

---

## KEY PATTERNS IMPLEMENTED

- **Separation of Concerns**
  - Create and Edit operations split into separate modals

- **Status Variable**
  - Standardized `is_active` boolean across modules

- **API Utilities**
  - Centralized `apiFetch()` with auth headers

- **Mode Management**
  - Single `activeMode` replaces multiple flags

- **Reactive Watchers**
  - Proper `watch()` usage for prop syncing

- **File Upload**
  - Added image/logo upload for IA & Merchant

- **Module Naming**
  - Standardized `ModuleName.vue` format

---

## SUMMARY OF IMPROVEMENTS

### Code Organization

- Reduced `ScheduleModule.vue` from **864 → 267 lines**

### Feature Additions

- Image/logo upload (IA & Merchant)
- Dedicated schedule edit modal
- Improved seatmap facility management

### State Management

- Replaced `status` string with `is_active` boolean
- Removed redundant modal props
- Centralized API calls

### UI/UX Improvements

- Consistent status tracking across modules
- Improved seatmap interface
- Better error handling and loading states
