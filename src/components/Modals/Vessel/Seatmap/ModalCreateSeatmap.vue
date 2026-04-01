<script setup>
import {
  Accessibility,
  AirVent,
  Footprints,
  LayoutGridIcon,
  OctagonX,
  RotateCcw,
  SquarePen,
  Store,
  Wifi,
} from "lucide-vue-next";
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  vesselId: { type: [Number, String], required: true },
  accommodations: { type: Array, default: () => [] },
  seatmap: { type: Array, default: () => [] },
});

const emit = defineEmits(["save", "close"]);
const apiBase = import.meta.env.VITE_API_URL;
const currentSelectedClass = ref(null);
const addedClasses = ref([]);
const isLoading = ref(false);
const errorMsg = ref("");
const tempRows = ref(null);
const tempColumns = ref(null);
const isDragging = ref(false);
const activeMode = ref(null);
const dragStart = ref(null);
const dragMode = ref(null);
const lastHoveredSeat = ref(null);
const seatSize = 44;

const recomputeFacilityLabels = (seats) => {
  const facilityMap = {};
  seats.forEach((s) => {
    if (s.facility) {
      if (!facilityMap[s.facility])
        facilityMap[s.facility] = { rows: [], cols: [] };
      facilityMap[s.facility].rows.push(s.row);
      facilityMap[s.facility].cols.push(s.col);
    }
  });
  return Object.entries(facilityMap).map(([name, { rows, cols }]) => {
    const r1 = Math.min(...rows),
      r2 = Math.max(...rows);
    const c1 = Math.min(...cols),
      c2 = Math.max(...cols);
    return {
      name,
      top: r1 * seatSize,
      left: c1 * seatSize,
      width: (c2 - c1 + 1) * seatSize,
      height: (r2 - r1 + 1) * seatSize,
    };
  });
};

const initClasses = () => {
  if (props.seatmap?.length) {
    addedClasses.value = props.seatmap.map((cls) => {
      const seats = (cls.seats || []).map((s) => ({ ...s }));
      return {
        name: cls.name || cls.accommodation_name,
        aircon: cls.aircon ?? true,
        wifi: cls.wifi ?? false,
        rows: cls.rows || null,
        columns: cls.columns || null,
        seats,
        facilityLabels: recomputeFacilityLabels(seats),
      };
    });
  } else if (props.accommodations?.length) {
    addedClasses.value = props.accommodations.map((a) => ({
      name: a.name || a.accommodationName,
      aircon: a.aircon ?? true,
      wifi: a.wifi ?? false,
      rows: null,
      columns: null,
      seats: [],
      facilityLabels: [],
    }));
  }

  if (addedClasses.value.length) {
    currentSelectedClass.value = addedClasses.value[0];
  }
};

const selectClass = (item) => {
  currentSelectedClass.value = item;
  tempRows.value = item.rows || null;
  tempColumns.value = item.columns || null;
};

const removeFacilityBySeat = (seat) => {
  const cls = currentSelectedClass.value;
  if (!cls || !seat.facility) return;
  const facilityName = seat.facility;
  if (!confirm(`Remove facility "${facilityName}"?`)) return;
  cls.seats.forEach((s) => {
    if (s.facility === facilityName) s.facility = null;
  });
  cls.facilityLabels = cls.facilityLabels.filter(
    (f) => f.name !== facilityName,
  );
  activeMode.value = null;
};

const generateSeats = () => {
  const cls = currentSelectedClass.value;
  if (!cls || !tempRows.value || !tempColumns.value)
    return alert("Enter rows and columns first.");
  cls.rows = Number(tempRows.value);
  cls.columns = Number(tempColumns.value);
  cls.seats = [];
  cls.facilityLabels = [];
  for (let r = 0; r < cls.rows; r++) {
    for (let c = 0; c < cls.columns; c++) {
      cls.seats.push({
        seat_no: `${r + 1}${String.fromCharCode(65 + c)}`,
        row: r,
        col: c,
        blocked: false,
        path: false,
        pwd: false,
        facility: null,
        renaming: false,
      });
    }
  }
};

const toggleMode = (mode) => {
  activeMode.value = activeMode.value === mode ? null : mode;
};

const startDrag = (seat, event) => {
  if (event.button !== 0) return;
  event.preventDefault();
  dragStart.value = seat;
  isDragging.value = false;
  lastHoveredSeat.value = seat;
  if (!activeMode.value) return;
  dragMode.value = activeMode.value;
  switch (dragMode.value) {
    case "rename":
      seat.renaming = true;
      break;
    case "facility":
      if (seat.facility && seat.facility !== "…") {
        removeFacilityBySeat(seat);
        dragStart.value = null;
        dragMode.value = null;
        return;
      }
      seat.facility = "…";
      break;
    case "block":
      seat.initialBlocked = seat.blocked;
      seat.blocked = !seat.blocked;
      seat.path = false;
      break;
    case "path":
      seat.initialPath = seat.path;
      seat.path = !seat.path;
      seat.blocked = false;
      break;
    case "pwd":
      seat.initialPwd = seat.pwd;
      seat.pwd = !seat.pwd;
      seat.blocked = false;
      seat.path = false;
      seat.facility = null;
      break;
  }
};

const dragSeats = (seat) => {
  if (!dragStart.value || !dragMode.value) return;
  isDragging.value = true;
  lastHoveredSeat.value = seat;
  const start = dragStart.value;
  const r1 = Math.min(start.row, seat.row);
  const r2 = Math.max(start.row, seat.row);
  const c1 = Math.min(start.col, seat.col);
  const c2 = Math.max(start.col, seat.col);
  currentSelectedClass.value.seats.forEach((s) => {
    if (s.row >= r1 && s.row <= r2 && s.col >= c1 && s.col <= c2) {
      if (dragMode.value === "rename") s.renaming = true;
      if (dragMode.value === "facility") s.facility = "…";
      if (dragMode.value === "block") s.blocked = !start.initialBlocked;
      if (dragMode.value === "path") s.path = !start.initialPath;
      if (dragMode.value === "pwd") {
        s.pwd = !start.initialPwd;
        s.blocked = false;
        s.path = false;
        s.facility = null;
      }
    } else {
      if (dragMode.value === "rename") s.renaming = false;
      if (dragMode.value === "facility" && s.facility === "…")
        s.facility = null;
    }
  });
};

const handleGlobalMouseUp = () => {
  if (dragStart.value) endDrag();
};

const endDrag = () => {
  if (!dragStart.value) return;
  if (dragMode.value === "rename" && isDragging.value) {
    const baseName = prompt("Enter starting seat number:", "001A");
    if (!baseName) {
      currentSelectedClass.value.seats.forEach((s) => (s.renaming = false));
    } else {
      const match = baseName.match(/^(\d+)([A-Z])$/);
      if (!match) return alert("Format should be like 001A");
      let [_, startNum, letter] = match;
      startNum = parseInt(startNum, 10);
      const seatsToRename = currentSelectedClass.value.seats
        .filter((s) => s.renaming)
        .sort((a, b) => a.row - b.row || a.col - b.col);
      seatsToRename.forEach((s, idx) => {
        s.seat_no = String(startNum + idx).padStart(3, "0") + letter;
        s.renaming = false;
      });
    }
  }
  if (dragMode.value === "facility" && isDragging.value) {
    const seatsToLabel = currentSelectedClass.value.seats.filter(
      (s) => s.facility === "…",
    );
    if (seatsToLabel.length) {
      const r1 = Math.min(...seatsToLabel.map((s) => s.row));
      const r2 = Math.max(...seatsToLabel.map((s) => s.row));
      const c1 = Math.min(...seatsToLabel.map((s) => s.col));
      const c2 = Math.max(...seatsToLabel.map((s) => s.col));
      const name = prompt("Enter facility name:", "Facility");
      if (!name) seatsToLabel.forEach((s) => (s.facility = null));
      else {
        seatsToLabel.forEach((s) => {
          s.facility = name;
          s.blocked = false;
          s.path = false;
        });
        currentSelectedClass.value.facilityLabels.push({
          name,
          left: c1 * seatSize,
          top: r1 * seatSize,
          width: (c2 - c1 + 1) * seatSize,
          height: (r2 - r1 + 1) * seatSize,
        });
      }
    }
  }
  dragStart.value = null;
  dragMode.value = null;
  activeMode.value = null;
  isDragging.value = false;
  lastHoveredSeat.value = null;
};

const onSeatClick = (seat) => {
  if (dragStart.value && isDragging.value) return;
  if (activeMode.value === "facility") {
    if (seat.facility) removeFacilityBySeat(seat);
    else {
      seat.facility = "…";
      const name = prompt("Enter facility name:", "Facility");
      if (name) {
        seat.facility = name;
        seat.blocked = false;
        seat.path = false;
      } else seat.facility = null;
    }
    return;
  }
  if (activeMode.value === "pwd") {
    seat.pwd = !seat.pwd;
    seat.blocked = false;
    seat.path = false;
    seat.facility = null;
    return;
  }
  if (activeMode.value === "rename") {
    const n = prompt("Rename seat:", seat.seat_no);
    if (n?.trim()) {
      seat.seat_no = n.trim();
      activeMode.value = null;
    }
    currentSelectedClass.value.seats.forEach((s) => (s.renaming = false));
    return;
  }
  if (activeMode.value === "block") {
    seat.blocked = !seat.blocked;
    seat.path = false;
    seat.pwd = false;
    return;
  }
  if (activeMode.value === "path") {
    seat.path = !seat.path;
    seat.blocked = false;
    seat.pwd = false;
    return;
  }
};

const resetSeats = () => {
  if (!currentSelectedClass.value) return;
  currentSelectedClass.value.seats.forEach((s) => {
    s.blocked = false;
    s.path = false;
    s.facility = null;
    s.renaming = false;
    s.pwd = false;
  });
  currentSelectedClass.value.facilityLabels = [];
};

const saveSeatmap = async () => {
  if (!addedClasses.value.length)
    return alert("No accommodations available. Set them up first.");
  const classWithNoSeats = addedClasses.value.find((c) => !c.seats?.length);
  if (classWithNoSeats)
    return alert(
      `"${classWithNoSeats.name}" has no seats. Please generate a layout first.`,
    );

  const payload = addedClasses.value.map((c) => ({
    name: c.name,
    rows: c.rows ?? 0,
    columns: c.columns ?? 0,
    seats: c.seats ?? [],
    aircon: c.aircon ?? true,
    wifi: c.wifi ?? false,
    facilityLabels: c.facilityLabels ?? [],
  }));

  isLoading.value = true;
  errorMsg.value = "";
  try {
    const res = await fetch(`${apiBase}/vessels/${props.vesselId}/layout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json();
      errorMsg.value = data.message || "Failed to save seatmap.";
      return;
    }
    emit("save");
  } catch (err) {
    console.error("Failed saving seatmap:", err);
    errorMsg.value = "Failed to save seatmap. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  window.addEventListener("mouseup", handleGlobalMouseUp);
  initClasses();
});
onUnmounted(() => window.removeEventListener("mouseup", handleGlobalMouseUp));
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-[1750px] mx-4"
      @click.stop
    >
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <h2 class="text-lg font-semibold text-gray-900">Create Seatmap</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <form @submit.prevent="saveSeatmap">
        <div class="grid grid-cols-[0.5fr_0.75fr_1.25fr]">
          <!-- LEFT: Accommodation selector -->
          <div class="h-[600px] overflow-y-auto p-6 border-r border-gray-200">
            <p class="text-sm font-medium text-gray-700 mb-3">Accommodations</p>
            <div
              v-if="addedClasses.length === 0"
              class="text-sm text-gray-400 text-center py-8"
            >
              No accommodations found.
            </div>
            <div class="space-y-2">
              <div
                v-for="(item, i) in addedClasses"
                :key="i"
                :class="[
                  'flex flex-col p-3 rounded-lg border cursor-pointer transition-colors',
                  currentSelectedClass?.name === item.name
                    ? 'bg-blue-50 border-blue-300'
                    : 'border-gray-200 hover:bg-gray-50',
                ]"
                @click="selectClass(item)"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-800 truncate">{{
                    item.name
                  }}</span>
                  <div class="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <AirVent
                      :class="[
                        'w-3.5 h-3.5',
                        item.aircon ? 'text-blue-500' : 'text-gray-300',
                      ]"
                    />
                    <Wifi
                      :class="[
                        'w-3.5 h-3.5',
                        item.wifi ? 'text-blue-500' : 'text-gray-300',
                      ]"
                    />
                  </div>
                </div>
                <p class="text-xs text-gray-400 mt-1 pl-0.5">
                  {{ item.seats?.length || 0 }} seats
                  <span v-if="item.rows && item.columns"
                    >({{ item.rows }}×{{ item.columns }})</span
                  >
                </p>
              </div>
            </div>
          </div>

          <!-- MIDDLE: Tools -->
          <div class="p-6 border-r border-gray-300">
            <div v-if="currentSelectedClass">
              <div class="flex items-center justify-center mb-4">
                <label class="font-bold text-xl">{{
                  currentSelectedClass.name
                }}</label>
              </div>
              <div class="flex flex-col gap-4 mb-4">
                <div class="flex gap-4 w-full">
                  <div class="flex-1">
                    <label class="text-sm mb-1 block text-gray-700"
                      >Row Seats</label
                    >
                    <input
                      type="number"
                      v-model.number="tempRows"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div class="flex-1">
                    <label class="text-sm mb-1 block text-gray-700"
                      >Column Seats</label
                    >
                    <input
                      type="number"
                      v-model.number="tempColumns"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  @click="generateSeats"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-100 transition-colors"
                >
                  <LayoutGridIcon class="w-4 h-4" /> Generate Layout
                </button>
              </div>
            </div>
            <div v-else class="text-sm text-gray-400 text-center py-6">
              Select an accommodation to start editing
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="toggleMode('rename')"
                :disabled="!currentSelectedClass"
                :class="[
                  'px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium border rounded-md transition-colors',
                  !currentSelectedClass
                    ? 'opacity-40 cursor-not-allowed text-gray-400'
                    : activeMode === 'rename'
                      ? 'bg-blue-400 text-white border-blue-500'
                      : 'bg-blue-100 text-gray-700 border-blue-300 hover:bg-blue-300',
                ]"
              >
                <SquarePen class="w-4 h-4" /> Rename Seat
              </button>
              <button
                type="button"
                @click="toggleMode('block')"
                :disabled="!currentSelectedClass"
                :class="[
                  'px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium border rounded-md transition-colors',
                  !currentSelectedClass
                    ? 'opacity-40 cursor-not-allowed text-gray-400'
                    : activeMode === 'block'
                      ? 'bg-red-400 text-white border-red-500'
                      : 'bg-red-100 text-gray-700 border-red-300 hover:bg-red-300',
                ]"
              >
                <OctagonX class="w-4 h-4" /> Block/Unblock
              </button>
              <button
                type="button"
                @click="toggleMode('path')"
                :disabled="!currentSelectedClass"
                :class="[
                  'px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium border rounded-md transition-colors',
                  !currentSelectedClass
                    ? 'opacity-40 cursor-not-allowed text-gray-400'
                    : activeMode === 'path'
                      ? 'bg-yellow-400 text-white border-yellow-500'
                      : 'bg-yellow-100 text-gray-700 border-yellow-300 hover:bg-yellow-300',
                ]"
              >
                <Footprints class="w-4 h-4" /> Walk Path
              </button>
              <button
                type="button"
                @click="toggleMode('facility')"
                :disabled="!currentSelectedClass"
                :class="[
                  'px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium border rounded-md transition-colors',
                  !currentSelectedClass
                    ? 'opacity-40 cursor-not-allowed text-gray-400'
                    : activeMode === 'facility'
                      ? 'bg-orange-400 text-white border-orange-500'
                      : 'bg-orange-100 text-gray-700 border-orange-300 hover:bg-orange-300',
                ]"
              >
                <Store class="w-4 h-4" /> Facilities
              </button>
              <button
                type="button"
                @click="toggleMode('pwd')"
                :disabled="!currentSelectedClass"
                :class="[
                  'px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium border rounded-md transition-colors',
                  !currentSelectedClass
                    ? 'opacity-40 cursor-not-allowed text-gray-400'
                    : activeMode === 'pwd'
                      ? 'bg-green-400 text-white border-green-500'
                      : 'bg-green-100 text-gray-700 border-green-300 hover:bg-green-300',
                ]"
              >
                <Accessibility class="w-4 h-4" /> PWD
              </button>
              <button
                type="button"
                @click="resetSeats"
                :disabled="!currentSelectedClass"
                :class="[
                  'px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium border rounded-md transition-colors',
                  !currentSelectedClass
                    ? 'opacity-40 cursor-not-allowed text-gray-400'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-300',
                ]"
              >
                <RotateCcw class="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          <!-- RIGHT: Seatmap Preview — now matches ModalBlockSeats design -->
          <div class="p-6 bg-gray-50 flex flex-col">
            <p class="text-sm font-medium text-gray-700 mb-3 text-center">
              Seatmap Preview
            </p>

            <!-- Legend -->
            <div class="flex items-center gap-4 mb-4 flex-wrap">
              <div class="flex items-center gap-1.5">
                <span
                  class="w-4 h-4 rounded bg-white border border-gray-300 flex-shrink-0"
                ></span>
                <span class="text-xs text-gray-500">Available</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-4 h-4 rounded bg-red-600 flex-shrink-0"></span>
                <span class="text-xs text-gray-500">Blocked</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-4 h-4 rounded bg-gray-200 flex-shrink-0"></span>
                <span class="text-xs text-gray-500">Path</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-4 h-4 rounded bg-green-400 flex-shrink-0"></span>
                <span class="text-xs text-gray-500">PWD</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span
                  class="w-4 h-4 rounded bg-orange-400 flex-shrink-0"
                ></span>
                <span class="text-xs text-gray-500">Facility</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span
                  class="w-4 h-4 rounded ring-2 ring-blue-400 bg-blue-200 flex-shrink-0"
                ></span>
                <span class="text-xs text-gray-500">Renaming</span>
              </div>
            </div>

            <!-- Seat grid -->
            <div
              class="flex-1 min-w-0 overflow-x-auto overflow-y-auto max-w-4xl bg-white rounded-lg border border-gray-200 p-4"
            >
              <div
                v-if="!currentSelectedClass"
                class="flex items-center justify-center h-full text-sm text-gray-400"
              >
                Select an accommodation to preview
              </div>
              <div
                v-else-if="!currentSelectedClass.seats?.length"
                class="flex items-center justify-center h-full text-sm text-gray-400"
              >
                No seats generated yet. Enter rows & columns and click Generate
                Layout.
              </div>
              <div
                v-else
                class="relative select-none min-w-full"
                :style="{
                  width: currentSelectedClass.columns * seatSize + 'px',
                  height: currentSelectedClass.rows * seatSize + 'px',
                }"
              >
                <div
                  v-for="seat in currentSelectedClass.seats"
                  :key="seat.seat_no"
                  class="absolute flex items-center justify-center border rounded-md text-xs font-medium cursor-pointer transition-colors"
                  :style="{
                    width: seatSize - 4 + 'px',
                    height: seatSize - 4 + 'px',
                    top: seat.row * seatSize + 2 + 'px',
                    left: seat.col * seatSize + 2 + 'px',
                  }"
                  :class="{
                    'bg-red-600 border-red-700 text-white hover:bg-red-500':
                      seat.blocked,
                    'bg-gray-200 border-gray-300 text-gray-400 cursor-default':
                      seat.path && !seat.blocked,
                    'bg-orange-400 border-orange-500 text-white cursor-default':
                      seat.facility && !seat.blocked && !seat.path,
                    'bg-green-400 border-green-500 text-black':
                      seat.pwd && !seat.blocked && !seat.path && !seat.facility,
                    'ring-2 ring-blue-400 bg-blue-200 border-blue-300':
                      seat.renaming,
                    'bg-white border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-300':
                      !seat.blocked &&
                      !seat.path &&
                      !seat.facility &&
                      !seat.pwd &&
                      !seat.renaming,
                  }"
                  @mousedown="startDrag(seat, $event)"
                  @mouseover="dragSeats(seat)"
                  @click="onSeatClick(seat)"
                >
                  <span
                    v-if="seat.blocked"
                    class="text-white font-bold text-sm pointer-events-none"
                    >✕</span
                  >
                  <span
                    v-else-if="!seat.path && !seat.facility"
                    class="pointer-events-none"
                  >
                    {{ seat.seat_no }}
                  </span>
                </div>

                <!-- Facility labels overlay -->
                <div
                  v-for="(f, i) in currentSelectedClass.facilityLabels || []"
                  :key="i"
                  class="absolute flex items-center justify-center text-white font-bold pointer-events-none bg-orange-500 rounded-md text-xs"
                  :style="{
                    top: f.top + 2 + 'px',
                    left: f.left + 2 + 'px',
                    width: f.width - 4 + 'px',
                    height: f.height - 4 + 'px',
                    zIndex: 10,
                  }"
                >
                  {{ f.name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex items-center justify-end gap-3 p-6 border-t border-gray-200"
        >
          <p v-if="errorMsg" class="text-sm text-red-500 mr-auto">
            {{ errorMsg }}
          </p>
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <span
                class="inline-block w-4 h-4 rounded-full border-4 border-white border-t-transparent animate-spin"
              ></span>
              Saving...
            </span>
            <span v-else>Save Seatmap</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
