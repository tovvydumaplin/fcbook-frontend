<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
  vessel: { type: Object, required: true },
});

const emit = defineEmits(["close", "saved"]);

const apiBase = import.meta.env.VITE_API_URL;
const isLoading = ref(false);
const isSaving = ref(false);
const errorMsg = ref("");
const classes = ref([]);
const currentClass = ref(null);
const isDragging = ref(false);
const dragStart = ref(null);
const wasDragging = ref(false);
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

const fetchLayout = async () => {
  isLoading.value = true;
  errorMsg.value = "";
  try {
    const res = await fetch(
      `${apiBase}/vessels/${props.vessel.vesselId}/layout`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch layout");

    const data = await res.json();
    classes.value = (data.classes || []).map((cls) => {
      const seats = (cls.seats || []).map((s) => ({ ...s }));
      return {
        name: cls.name || cls.accommodation_name,
        rows: cls.rows,
        columns: cls.columns,
        aircon: cls.aircon,
        wifi: cls.wifi,
        facilityLabels: recomputeFacilityLabels(seats),
        seats,
      };
    });

    if (classes.value.length) currentClass.value = classes.value[0];
  } catch (err) {
    console.error(err);
    errorMsg.value = "Failed to load seatmap. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const selectClass = (cls) => {
  currentClass.value = cls;
};

const blockedCount = computed(
  () => currentClass.value?.seats.filter((s) => s.blocked).length ?? 0,
);

const totalSeats = computed(() => currentClass.value?.seats.length ?? 0);

// ===== DRAG BLOCK =====
const startDrag = (seat, event) => {
  if (event.button !== 0) return;
  event.preventDefault();
  dragStart.value = seat;
  isDragging.value = false;
  wasDragging.value = false;
  seat.initialBlocked = seat.blocked;
};

const dragOver = (seat) => {
  if (!dragStart.value) return;
  isDragging.value = true;
  wasDragging.value = true;

  const start = dragStart.value;
  const r1 = Math.min(start.row, seat.row);
  const r2 = Math.max(start.row, seat.row);
  const c1 = Math.min(start.col, seat.col);
  const c2 = Math.max(start.col, seat.col);

  currentClass.value.seats.forEach((s) => {
    if (s.row >= r1 && s.row <= r2 && s.col >= c1 && s.col <= c2) {
      s.blocked = !start.initialBlocked;
    }
  });
};

const endDrag = () => {
  dragStart.value = null;
  isDragging.value = false;
};

const handleGlobalMouseUp = () => {
  if (dragStart.value) endDrag();
};

const toggleSeat = (seat) => {
  if (wasDragging.value) {
    wasDragging.value = false;
    return;
  }
  if (seat.path || seat.facility) return;
  seat.blocked = !seat.blocked;
};

const resetBlocked = () => {
  if (!currentClass.value) return;
  currentClass.value.seats.forEach((s) => (s.blocked = false));
};

const save = async () => {
  isSaving.value = true;
  errorMsg.value = "";
  try {
    const payload = classes.value.map((c) => ({
      name: c.name,
      rows: c.rows ?? 0,
      columns: c.columns ?? 0,
      aircon: c.aircon ?? true,
      wifi: c.wifi ?? false,
      facilityLabels: c.facilityLabels ?? [],
      seats: c.seats ?? [],
    }));

    const res = await fetch(
      `${apiBase}/vessels/${props.vessel.vesselId}/layout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const data = await res.json();
      errorMsg.value = data.message || "Failed to save.";
      return;
    }

    emit("saved");
  } catch (err) {
    console.error(err);
    errorMsg.value = "Something went wrong. Please try again.";
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  window.addEventListener("mouseup", handleGlobalMouseUp);
  fetchLayout();
});
onUnmounted(() => window.removeEventListener("mouseup", handleGlobalMouseUp));
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-7xl mx-4">
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">Block Seats</h2>
          <p class="text-sm text-gray-500 mt-0.5">
            {{ vessel.vesselName }} — click or drag to block / unblock seats
          </p>
        </div>
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
      <div class="grid grid-cols-[0.3fr_1fr] min-h-[480px]">
        <!-- LEFT: Accommodation selector -->
        <div
          class="border-r border-gray-200 p-4 flex flex-col gap-2 overflow-y-auto"
        >
          <p
            class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1"
          >
            Accommodation
          </p>

          <div v-if="isLoading" class="flex justify-center py-8">
            <span
              class="w-5 h-5 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
            ></span>
          </div>

          <div
            v-else-if="classes.length === 0"
            class="text-sm text-gray-400 text-center py-6"
          >
            No seatmap found for this vessel.
          </div>

          <button
            v-else
            v-for="cls in classes"
            :key="cls.name"
            type="button"
            @click="selectClass(cls)"
            :class="[
              'w-full text-left px-3 py-3 rounded-lg border transition-colors',
              currentClass?.name === cls.name
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-gray-200 hover:bg-gray-50 text-gray-700',
            ]"
          >
            <p class="text-sm font-medium truncate">{{ cls.name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ cls.seats.filter((s) => s.blocked).length }} /
              {{ cls.seats.length }} blocked
            </p>
          </button>
        </div>

        <!-- RIGHT: Seatmap -->
        <div class="p-6 bg-gray-50 flex flex-col">
          <div
            v-if="!currentClass"
            class="flex-1 flex items-center justify-center text-sm text-gray-400"
          >
            Select an accommodation on the left
          </div>

          <div
            v-else-if="isLoading"
            class="flex-1 flex items-center justify-center"
          >
            <span
              class="w-6 h-6 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"
            ></span>
          </div>

          <template v-else>
            <!-- Stats bar -->
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-4">
                <span class="text-sm font-semibold text-gray-800">{{
                  currentClass.name
                }}</span>
                <span class="text-xs text-gray-500">
                  <span class="font-medium text-red-600">{{
                    blockedCount
                  }}</span>
                  blocked / {{ totalSeats }} total
                </span>
              </div>
              <button
                type="button"
                @click="resetBlocked"
                class="text-xs text-gray-500 hover:text-red-500 border border-gray-300 hover:border-red-300 px-3 py-1.5 rounded-md transition-colors"
              >
                Clear All Blocks
              </button>
            </div>

            <!-- Legend -->
            <div class="flex items-center gap-4 mb-4">
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
            </div>

            <!-- Seats grid -->
            <div
              class="flex-1 overflow-auto max-w-4xl bg-white rounded-lg border border-gray-200 p-4"
            >
              <div
                v-if="!currentClass.seats?.length"
                class="text-sm text-gray-400 text-center py-8"
              >
                No seats found for this accommodation.
              </div>
              <div
                v-else
                class="relative select-none"
                :style="{
                  width: currentClass.columns * seatSize + 'px',
                  height: currentClass.rows * seatSize + 'px',
                }"
              >
                <!-- Seats -->
                <div
                  v-for="seat in currentClass.seats"
                  :key="seat.seat_no"
                  class="absolute flex items-center justify-center border rounded-md text-xs font-medium transition-colors"
                  :style="{
                    width: seatSize - 4 + 'px',
                    height: seatSize - 4 + 'px',
                    top: seat.row * seatSize + 2 + 'px',
                    left: seat.col * seatSize + 2 + 'px',
                  }"
                  :class="{
                    'bg-red-600 border-red-700 text-white cursor-pointer hover:bg-red-500':
                      seat.blocked,
                    'bg-gray-200 border-gray-300 text-gray-400 cursor-default':
                      seat.path && !seat.blocked,
                    'bg-orange-400 border-orange-500 text-white cursor-default':
                      seat.facility && !seat.blocked && !seat.path,
                    'bg-green-400 border-green-500 text-black cursor-pointer hover:bg-red-200':
                      seat.pwd && !seat.blocked && !seat.path && !seat.facility,
                    'bg-white border-gray-200 text-gray-700 cursor-pointer hover:bg-red-50 hover:border-red-300':
                      !seat.blocked &&
                      !seat.path &&
                      !seat.facility &&
                      !seat.pwd,
                  }"
                  @mousedown="startDrag(seat, $event)"
                  @mouseover="dragOver(seat)"
                  @click="toggleSeat(seat)"
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
                  v-for="(f, i) in currentClass.facilityLabels || []"
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
          </template>
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
          type="button"
          @click="save"
          :disabled="isSaving || isLoading || classes.length === 0"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <span
            v-if="isSaving"
            class="inline-block w-4 h-4 rounded-full border-4 border-white border-t-transparent animate-spin"
          ></span>
          {{ isSaving ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </div>
  </div>
</template>
