<script setup>
import {
  Accessibility,
  AirVent,
  Footprints,
  LayoutGridIcon,
  Map,
  OctagonX,
  RotateCcw,
  SquarePen,
  Store,
  Trash2,
  Wifi,
} from "lucide-vue-next";
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({ seatmap: Object, vesselId: [Number, String] });

const emit = defineEmits(["save", "close"]);
const apiBase = import.meta.env.VITE_API_URL;
const currentSelectedClass = ref(null);
const addedClasses = ref([]);
const isOpen = ref(false);
const selectedClassIndex = ref(null);
const isLoading = ref(false);
const errorMsg = ref("");
const tempRows = ref(null);
const tempColumns = ref(null);
const isDragging = ref(false);
const activeMode = ref(null);
const accomodations = ref([]);
const isSeatmapLoading = ref(false);
const dragStart = ref(null);
const dragMode = ref(null);
const lastHoveredSeat = ref(null);
const seatSize = 40;
const availableClasses = computed(() =>
  accomodations.value.filter(
    (a) => !addedClasses.value.some((c) => c.name === a.name),
  ),
);

if (props.seatmap?.length) {
  addedClasses.value = props.seatmap.map((cls) => ({
    name: cls.name || cls.accommodation_name,
    aircon: cls.aircon ?? true,
    wifi: cls.wifi ?? false,
    rows: cls.rows || null,
    columns: cls.columns || null,
    seats: cls.seats || [],
    facilityLabels: cls.facilityLabels || [],
  }));

  currentSelectedClass.value = addedClasses.value[0];
}

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

const selectClass = (item) => {
  currentSelectedClass.value = item;
  tempRows.value = item.rows || null;
  tempColumns.value = item.columns || null;
};

const openAddClass = () => {
  isOpen.value = true;
};

const addClass = () => {
  if (!selectedClassIndex.value) {
    alert("Please select accommodation first");
    return;
  }

  const selected = accomodations.value.find(
    (a) => a.id === selectedClassIndex.value,
  );

  if (!selected) {
    alert("Invalid accommodation selected");
    return;
  }

  addedClasses.value.push({
    id: selected.id,
    name: selected.name,
    aircon: selected.aircon,
    wifi: selected.wifi,
    rows: null,
    columns: null,
    seats: [],
    facilityLabels: [],
  });

  selectedClassIndex.value = null;
  isOpen.value = false;
};

const cancelAction = () => (isOpen.value = false);
const saveChanges = () => addClass();

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

// ===== START DRAG =====
const startDrag = (seat, event) => {
  if (event.button !== 0) return;
  event.preventDefault();

  dragStart.value = seat;
  isDragging.value = false;
  lastHoveredSeat.value = seat;

  // Determine current drag mode
  if (!activeMode.value) return;
  dragMode.value = activeMode.value;

  // Initialize seat state for drag
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

// ===== DRAG SEATS =====
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

// ===== END DRAG =====
const handleGlobalMouseUp = () => {
  if (dragStart.value) endDrag();
};
const endDrag = () => {
  if (!dragStart.value) return;
  // Handle rename drag
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
  // Handle facility drag
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

// ===== SEAT CLICK  =====
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

// ===== RESET =====
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

const removeClass = (index) => {
  if (addedClasses.value[index] === currentSelectedClass.value)
    currentSelectedClass.value = null;
  addedClasses.value.splice(index, 1);
};
const fetchAccommodations = async () => {
  isSeatmapLoading.value = true;
  try {
    const res = await fetch(`${apiBase}/passenger-accommodations`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();

    if (res.ok && data.data) {
      accomodations.value = data.data.map((a) => ({
        id: a.accommodation_id,
        name: a.accommodation_name,
        aircon: a.aircon ?? true,
        wifi: a.wifi ?? false,
      }));
    } else {
      accomodations.value = [];
    }
  } catch (err) {
    console.error("Failed to fetch accommodations", err);
    accomodations.value = [];
  } finally {
    isSeatmapLoading.value = false;
  }
};

const saveSeatmap = async () => {
  if (!addedClasses.value.length)
    return alert("Add at least one class before saving!");

  const classWithNoSeats = addedClasses.value.find(
    (c) => !c.seats || !c.seats.length,
  );
  if (classWithNoSeats)
    return alert(
      `Class "${classWithNoSeats.name}" has no seats. Please add seats before saving.`,
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
  fetchAccommodations();
});
onUnmounted(() => window.removeEventListener("mouseup", handleGlobalMouseUp));
</script>

<style scoped>
.facility-label {
  z-index: 10;
}
</style>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-[1750px] mx-4"
      @click.stop
    >
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

      <!-- BODY -->
      <form @submit.prevent="saveSeatmap">
        <div v-if="isSeatmapLoading" class="p-6">Loading seatmap...</div>

        <div v-else>
          <div class="grid grid-cols-[0.5fr_0.75fr_1.25fr]">
            <!-- LEFT COLUMN -->
            <div class="seatmap_tools h-[600px] overflow-y-auto p-6">
              <!-- CLASS LIST -->
              <div class="mb-4">
                <p class="text-sm font-medium text-gray-700 mb-3">
                  List of Accommodations
                </p>
                <div class="mb-2 space-y-2">
                  <div
                    v-for="(item, i) in addedClasses"
                    :key="i"
                    :class="[
                      'flex flex-col p-2 rounded border transition-colors',
                      currentSelectedClass?.name === item.name
                        ? 'bg-blue-50 border-blue-300'
                        : 'border-gray-200 hover:bg-gray-50',
                    ]"
                  >
                    <!-- Top row: select button + name + delete -->
                    <div class="flex items-center justify-between gap-1">
                      <span class="text-sm font-medium flex-1 truncate">{{
                        item.name
                      }}</span>

                      <span
                        class="text-xs font-medium text-red-500 cursor-pointer hover:text-red-700 px-1"
                        @click.stop="removeClass(i)"
                      >
                        <Trash2 class="w-4 h-4" />
                      </span>
                      <button
                        type="button"
                        @click="selectClass(item)"
                        :class="[
                          'p-1 rounded transition-colors',
                          currentSelectedClass?.name === item.name
                            ? 'text-blue-600'
                            : 'text-gray-400 hover:text-blue-500',
                        ]"
                        title="Select to edit seatmap"
                      >
                        <Map class="w-4 h-4 mr-1" />
                      </button>
                    </div>
                    <!-- Bottom row: aircon + wifi toggles -->
                    <div class="flex items-center gap-4 mt-2 pl-7">
                      <!-- Aircon toggle -->
                      <label
                        class="flex items-center gap-1.5 cursor-pointer select-none"
                      >
                        <AirVent class="w-3.5 h-3.5" />

                        <span class="text-xs text-gray-600">AC</span>
                        <button
                          type="button"
                          @click.stop="item.aircon = !item.aircon"
                          :class="[
                            'relative inline-flex items-center w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0',
                            item.aircon ? 'bg-blue-500' : 'bg-gray-300',
                          ]"
                        >
                          <span
                            :class="[
                              'absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200',
                              item.aircon ? 'translate-x-4' : 'translate-x-0',
                            ]"
                          />
                        </button>
                      </label>

                      <!-- Wifi toggle -->
                      <label
                        class="flex items-center gap-1.5 cursor-pointer select-none"
                      >
                        <Wifi class="w-3.5 h-3.5" />
                        <span class="text-xs text-gray-600">WiFi</span>
                        <button
                          type="button"
                          @click.stop="item.wifi = !item.wifi"
                          :class="[
                            'relative inline-flex items-center w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0',
                            item.wifi ? 'bg-blue-500' : 'bg-gray-300',
                          ]"
                        >
                          <span
                            :class="[
                              'absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200',
                              item.wifi ? 'translate-x-4' : 'translate-x-0',
                            ]"
                          />
                        </button>
                      </label>
                    </div>
                  </div>
                </div>
                <div class="w-full mt-4">
                  <select
                    v-if="isOpen"
                    v-model="selectedClassIndex"
                    class="mb-4 w-full px-3 py-2 border rounded-md"
                  >
                    <option value="" disabled>Select accommodation</option>
                    <option
                      v-for="seat in availableClasses"
                      :key="seat.id"
                      :value="seat.id"
                    >
                      {{ seat.name }}
                    </option>
                  </select>

                  <button
                    v-if="!isOpen"
                    @click="openAddClass"
                    type="button"
                    class="w-full px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400"
                  >
                    + Add Class
                  </button>

                  <div v-if="isOpen" class="grid grid-cols-2 gap-4 w-full">
                    <button
                      @click="cancelAction"
                      type="button"
                      class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      @click="saveChanges"
                      type="button"
                      :disabled="!selectedClassIndex"
                      class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- MIDDLE COLUMN -->
            <div class="p-6 border-r border-l border-gray-300">
              <!-- GENERATE SEATS -->
              <div v-if="currentSelectedClass">
                <div class="flex items-center justify-center mb-4">
                  <label class="font-bold text-xl">{{
                    currentSelectedClass.name
                  }}</label>
                </div>
                <div class="gap-4 flex flex-col mb-4">
                  <div class="flex gap-6 w-full">
                    <div>
                      <label class="text-sm mb-2 text-gray-700"
                        >Row Seats</label
                      >
                      <input
                        type="number"
                        v-model.number="tempRows"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label class="text-sm mb-2 text-gray-700"
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
                    :class="
                      !currentSelectedClass
                        ? 'opacity-50 cursor-not-allowed'
                        : 'px-4 py-2 w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-700 border rounded-md hover:bg-gray-200 transition-colors '
                    "
                  >
                    <LayoutGridIcon class="w-4 h-4" />Generate Layout
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  @click="toggleMode('rename')"
                  :disabled="!currentSelectedClass"
                  :class="[
                    'px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 border rounded-md  transition-colors ',
                    !currentSelectedClass
                      ? 'opacity-40 cursor-not-allowed'
                      : activeMode === 'rename'
                        ? 'bg-blue-400'
                        : 'bg-blue-200 hover:bg-blue-400 hover:text-gray-800  border-blue-400',
                  ]"
                >
                  <SquarePen class="w-4 h-4" />Rename Seat
                </button>
                <button
                  type="button"
                  @click="toggleMode('block')"
                  :disabled="!currentSelectedClass"
                  :class="[
                    'px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 border rounded-md  transition-colors ',
                    !currentSelectedClass
                      ? 'opacity-40 cursor-not-allowed'
                      : activeMode === 'block'
                        ? 'bg-red-400'
                        : 'bg-red-200 hover:bg-red-400 hover:text-gray-800  border-red-400',
                  ]"
                >
                  <OctagonX class="w-4 h-4" /> Block/Unblock
                </button>
                <button
                  type="button"
                  @click="toggleMode('path')"
                  :disabled="!currentSelectedClass"
                  :class="[
                    'px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 border rounded-md  transition-colors ',
                    !currentSelectedClass
                      ? 'opacity-40 cursor-not-allowed'
                      : activeMode === 'path'
                        ? 'bg-yellow-400'
                        : 'bg-yellow-200 hover:bg-yellow-400 hover:text-gray-800  border-yellow-400',
                  ]"
                >
                  <Footprints class="w-4 h-4" /> Walk Path
                </button>
                <button
                  type="button"
                  @click="toggleMode('facility')"
                  :disabled="!currentSelectedClass"
                  :class="[
                    'px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 border rounded-md  transition-colors ',
                    !currentSelectedClass
                      ? 'opacity-40 cursor-not-allowed'
                      : activeMode === 'facility'
                        ? 'bg-orange-400'
                        : 'bg-orange-200 hover:bg-orange-400 hover:text-gray-800  border-orange-400',
                  ]"
                >
                  <Store class="w-4 h-4" /> Facilities
                </button>
                <button
                  type="button"
                  @click="toggleMode('pwd')"
                  :disabled="!currentSelectedClass"
                  :class="[
                    'px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 border rounded-md  transition-colors ',
                    !currentSelectedClass
                      ? 'opacity-40 cursor-not-allowed'
                      : activeMode === 'pwd'
                        ? 'bg-green-400'
                        : 'bg-green-200 hover:bg-green-400 hover:text-gray-800  border-green-400',
                  ]"
                >
                  <Accessibility class="w-4 h-4" />PWD
                </button>
                <button
                  type="button"
                  @click="resetSeats"
                  :disabled="!currentSelectedClass"
                  :class="[
                    'px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 border rounded-md  transition-colors ',
                    !currentSelectedClass
                      ? 'opacity-40 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-400 hover:text-gray-800  border-gray-400',
                  ]"
                >
                  <RotateCcw class="w-4 h-4" /> Reset Changes
                </button>
              </div>
            </div>

            <!-- RIGHT COLUMN - SEATMAP PREVIEW -->
            <div class="p-6 bg-gray-100">
              <div
                class="seatmap_preview border bg-white border-gray-400 h-full p-3 rounded-lg w-full"
              >
                <p class="text-sm text-center font-medium text-gray-700 mb-3">
                  Seatmap Preview
                </p>
                <div
                  class="flex items-center justify-center h-[500px] overflow-auto"
                >
                  <div
                    v-if="!currentSelectedClass"
                    class="text-center text-gray-500"
                  >
                    Select a class to preview
                  </div>
                  <div
                    v-else-if="!currentSelectedClass.seats?.length"
                    class="text-center text-gray-500"
                  >
                    No seats generated yet.
                  </div>

                  <div v-else class="relative w-full h-full">
                    <!-- Seats -->
                    <div
                      v-for="seat in currentSelectedClass.seats"
                      :key="seat.seat_no"
                      :data-row="seat.row"
                      :data-col="seat.col"
                      class="absolute flex items-center justify-center border rounded-md text-xs font-medium cursor-pointer select-none"
                      :style="{
                        width: seatSize + 'px',
                        height: seatSize + 'px',
                        top: seat.row * seatSize + 'px',
                        left: seat.col * seatSize + 'px',
                      }"
                      :class="{
                        'bg-gray-300': seat.path,
                        'bg-red-700 text-white': seat.blocked,
                        'bg-gray-100':
                          !seat.path &&
                          !seat.blocked &&
                          !seat.facility &&
                          !seat.renaming,
                        'bg-orange-400 text-white': seat.facility,
                        'bg-green-400 text-black': seat.pwd,
                        'ring-2 ring-blue-400 bg-blue-200': seat.renaming,
                      }"
                      @mousedown="startDrag(seat, $event)"
                      @mouseover="dragSeats(seat)"
                      @click="onSeatClick(seat)"
                    >
                      <span
                        v-if="!seat.blocked && !seat.path && !seat.facility"
                      >
                        {{ seat.seat_no }}
                      </span>
                      <span
                        v-if="seat.facility"
                        class="pointer-events-none font-bold text-white"
                        :style="{ opacity: 0.7 }"
                        >{{ seat.facility }}</span
                      >
                      <span
                        v-if="seat.blocked"
                        class="pointer-events-none text-white text-xl font-bold"
                        >✕</span
                      >
                    </div>
                    <!-- Floating Facility Labels -->
                    <div
                      v-for="(f, i) in currentSelectedClass.facilityLabels ||
                      []"
                      :key="i"
                      class="facility-label absolute flex items-center justify-center text-white font-bold pointer-events-none bg-orange-500 rounded-md"
                      :style="{
                        top: f.top + 'px',
                        left: f.left + 'px',
                        width: f.width + 'px',
                        height: f.height + 'px',
                      }"
                    >
                      {{ f.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FOOTER -->
        <div
          class="flex items-center justify-end gap-3 p-6 border-t border-gray-200"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
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
        <div v-if="errorMsg" class="text-red-500 text-sm pb-4 text-center">
          {{ errorMsg }}
        </div>
      </form>
    </div>
  </div>
</template>
