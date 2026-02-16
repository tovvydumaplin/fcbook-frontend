<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div
      class="modal-card bg-white rounded-lg shadow-xl w-[900px] mx-4"
      @click.stop
    >
      <!-- HEADER -->
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-lg font-semibold text-gray-900">Create Seatmap</h2>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor">
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
      <form class="p-6 space-y-6">
        <div v-if="isSeatmapLoading">Loading seatmap...</div>

        <div v-else>
          <!-- seatmap layout here -->
          <div class="grid grid-cols-[0.9fr_1.1fr] gap-6">
            <!-- LEFT SIDE -->
            <div class="seatmap_tools h-[410px] overflow-y-auto">
              <!-- CLASS LIST -->
              <div class="mb-4">
                <p class="text-sm font-medium text-gray-700 mb-3">
                  List of Class
                </p>
                <div class="mb-2 space-y-2">
                  <div
                    v-for="(item, i) in addedClasses"
                    :key="i"
                    @click="selectClass(item)"
                    class="flex justify-between p-1 rounded cursor-pointer"
                    :class="
                      currentSelectedClass?.name === item.name
                        ? 'bg-blue-200'
                        : 'hover:bg-gray-200'
                    "
                  >
                    <span class="text-sm font-medium">{{ item.name }}</span>
                    <span
                      class="text-sm font-medium text-red-500 cursor-pointer"
                      @click.stop="removeClass(i)"
                      >DEL</span
                    >
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

              <!-- GENERATE SEATS -->
              <div v-if="currentSelectedClass">
                <div class="flex gap-4 w-80 mb-4">
                  <div>
                    <label class="block text-sm mb-2 text-gray-700"
                      >Row Seats</label
                    >
                    <input
                      type="number"
                      v-model.number="tempRows"
                      class="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label class="block text-sm mb-2 text-gray-700"
                      >Column Seats</label
                    >
                    <input
                      type="number"
                      v-model.number="tempColumns"
                      class="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  @click="generateSeats"
                  class="w-full px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-400 mb-4"
                  :class="
                    !currentSelectedClass ? 'opacity-50 cursor-not-allowed' : ''
                  "
                >
                  Generate Seats
                </button>
              </div>

              <!-- MODE BUTTONS -->
              <div class="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  @click="toggleRenameMode"
                  :disabled="!currentSelectedClass"
                  :class="[
                    'px-4 py-2 rounded-md',
                    !currentSelectedClass
                      ? 'opacity-40 cursor-not-allowed'
                      : renameMode
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200',
                  ]"
                >
                  Rename Seat
                </button>

                <button
                  type="button"
                  @click="toggleBlockMode"
                  :disabled="!currentSelectedClass"
                  :class="[
                    'px-4 py-2 rounded-md',
                    !currentSelectedClass
                      ? 'opacity-40 cursor-not-allowed'
                      : blockMode
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200',
                  ]"
                >
                  Block/Unblock
                </button>

                <button
                  type="button"
                  @click="togglePathMode"
                  :disabled="!currentSelectedClass"
                  :class="[
                    'px-4 py-2 rounded-md',
                    !currentSelectedClass
                      ? 'opacity-40 cursor-not-allowed'
                      : pathMode
                        ? 'bg-yellow-400 text-white'
                        : 'bg-gray-200',
                  ]"
                >
                  Walk Path
                </button>

                <button
                  type="button"
                  @click="toggleFacilityMode"
                  :disabled="!currentSelectedClass"
                  :class="[
                    'px-4 py-2 rounded-md',
                    !currentSelectedClass
                      ? 'opacity-40 cursor-not-allowed'
                      : facilityMode
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200',
                  ]"
                >
                  Add Facility
                </button>
                <button
                  type="button"
                  @click="togglePwdMode"
                  :disabled="!currentSelectedClass"
                  :class="[
                    'px-4 py-2 rounded-md',
                    !currentSelectedClass
                      ? 'opacity-40 cursor-not-allowed'
                      : pwdMode
                        ? 'bg-[#016AB3] text-white'
                        : 'bg-gray-200',
                  ]"
                >
                  PWD
                </button>

                <button
                  type="button"
                  @click="resetSeats"
                  :disabled="!currentSelectedClass"
                  :class="[
                    'px-4 py-2 rounded-md',
                    !currentSelectedClass
                      ? 'opacity-40 cursor-not-allowed'
                      : 'bg-gray-200',
                  ]"
                >
                  Reset Changes
                </button>
              </div>
            </div>
            <!-- RIGHT SIDE - SEATMAP PREVIEW -->
            <div class="seatmap_preview border p-3 rounded-lg w-full">
              <p class="text-sm text-center font-medium text-gray-700 mb-3">
                Seatmap Preview
              </p>
              <div class="relative h-[410px] overflow-auto">
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
                    <span v-if="!seat.blocked && !seat.path && !seat.facility">
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
                    v-for="(f, i) in currentSelectedClass.facilityLabels || []"
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

        <!-- FOOTER -->
        <div class="flex justify-end gap-3 pt-6 border-t">
          <button type="button" @click="$emit('close')">Cancel</button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            :disabled="isLoading"
            @click="saveSeatmap"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <span
                class="inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
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

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({ seatmap: Object });
const emit = defineEmits(["save", "close"]);
const apiBase = import.meta.env.VITE_API_URL;
const currentSelectedClass = ref(null);
const addedClasses = ref([]);
const isOpen = ref(false);
const selectedClassIndex = ref(null);
const isLoading = ref(false);
const tempRows = ref(null);
const tempColumns = ref(null);
const isDragging = ref(false);
const pwdMode = ref(false);
const renameMode = ref(false);
const blockMode = ref(false);
const pathMode = ref(false);
const facilityMode = ref(false);
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
// Initialize addedClasses from seatmap prop
if (props.seatmap?.length) {
  addedClasses.value = props.seatmap.map((cls) => ({
    name: cls.name || cls.accommodation_name,
    rows: cls.rows || null,
    columns: cls.columns || null,
    seats: cls.seats || [],
    facilityLabels: cls.facilityLabels || [],
  }));

  // Auto-select the first class
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
  facilityMode.value = false;
};

const selectClass = (item) => {
  currentSelectedClass.value = item;
  tempRows.value = item.rows || null;
  tempColumns.value = item.columns || null;
};
const openAddClass = async () => {
  isOpen.value = true;

  // fetch only when button is clicked
  await fetchAccommodations();
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

const toggleRenameMode = () => (renameMode.value = !renameMode.value);
const togglePwdMode = () => {
  pwdMode.value = !pwdMode.value;
  renameMode.value = false;
  blockMode.value = false;
  pathMode.value = false;
  facilityMode.value = false;
};
const toggleBlockMode = () => {
  blockMode.value = !blockMode.value;
  renameMode.value = false;
  pathMode.value = false;
  facilityMode.value = false;
};
const togglePathMode = () => {
  pathMode.value = !pathMode.value;
  renameMode.value = false;
  blockMode.value = false;
  facilityMode.value = false;
};
const toggleFacilityMode = () => {
  facilityMode.value = !facilityMode.value;
  renameMode.value = false;
  blockMode.value = false;
  pathMode.value = false;
  dragStart.value = null;
};

// ===== START DRAG =====
const startDrag = (seat, event) => {
  if (event.button !== 0) return;
  event.preventDefault();

  dragStart.value = seat;
  isDragging.value = false;
  lastHoveredSeat.value = seat;

  // Determine current drag mode
  if (renameMode.value) dragMode.value = "rename";
  else if (facilityMode.value) dragMode.value = "facility";
  else if (blockMode.value) dragMode.value = "block";
  else if (pathMode.value) dragMode.value = "path";
  else if (pwdMode.value) dragMode.value = "pwd";
  else return;

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
  // renameMode.value = false;
  facilityMode.value = false;
  blockMode.value = false;
  pathMode.value = false;
  pwdMode.value = false;
  isDragging.value = false;
  lastHoveredSeat.value = null;
};

// ===== SEAT CLICK  =====
const onSeatClick = (seat) => {
  if (dragStart.value && isDragging.value) return;

  if (facilityMode.value) {
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

  if (pwdMode.value) {
    seat.pwd = !seat.pwd;
    seat.blocked = false;
    seat.path = false;
    seat.facility = null;
    return;
  }

  if (renameMode.value) {
    const n = prompt("Rename seat:", seat.seat_no);
    if (n?.trim()) {
      seat.seat_no = n.trim();
      // Turn off rename mode after confirming
      renameMode.value = false;
    }
    currentSelectedClass.value.seats.forEach((s) => (s.renaming = false));
    return;
  }

  if (blockMode.value) {
    seat.blocked = !seat.blocked;
    seat.path = false;
    seat.pwd = false;
    return;
  }

  if (pathMode.value) {
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
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${apiBase}/passenger-accommodations`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();

    if (res.ok && data.data) {
      accomodations.value = data.data.map((a) => ({
        id: a.accommodation_id, // FIXED
        name: a.accommodation_name,
      }));
    } else {
      accomodations.value = [];
    }
  } catch (err) {
    console.error("Failed to fetch accommodations", err);
    accomodations.value = [];
  }
};

const saveSeatmap = () => {
  if (!addedClasses.value.length)
    return alert("Add at least one class before saving!");

  // Check if any class has no seats
  const classWithNoSeats = addedClasses.value.find(
    (c) => !c.seats || !c.seats.length,
  );
  if (classWithNoSeats)
    return alert(
      `Class "${classWithNoSeats.name}" has no seats. Please add seats before saving.`,
    );

  isLoading.value = true;

  try {
    const payload = addedClasses.value.map((c) => {
      const source = accomodations.value.find((a) => a.name === c.name) || {};

      return {
        name: c.name,
        rows: c.rows ?? 0,
        columns: c.columns ?? 0,
        seats: c.seats ?? [],
        aircon: source.aircon ?? true,
        wifi: source.wifi ?? false,
        facilityLabels: c.facilityLabels ?? [],
      };
    });

    emit("save", payload);
  } catch (err) {
    console.error("Failed to build seatmap payload", err);
    alert("Failed to save seatmap. Check console for details.");
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => window.addEventListener("mouseup", handleGlobalMouseUp));
onUnmounted(() => window.removeEventListener("mouseup", handleGlobalMouseUp));
</script>

<style scoped>
.facility-label {
  z-index: 10;
}
</style>
