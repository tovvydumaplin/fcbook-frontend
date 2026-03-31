<script setup>
import { ref, computed, onMounted } from "vue";
import { AirVent, Wifi, Trash2, ChevronRight } from "lucide-vue-next";

const props = defineProps({
  vessel: { type: Object, required: true },
});
const emit = defineEmits(["close", "saved"]);

const apiBase = import.meta.env.VITE_API_URL;
const isSaving = ref(false);
const isPreviewLoading = ref(false);
const isAddingOpen = ref(false);
const errorMsg = ref("");
const selectedNewAccommodation = ref(null);
const availableAccommodations = ref([]);
const vesselAccommodations = ref([]);
const selectedAccommodation = ref(null);
const seatmapPreview = ref(null);
const seatSize = 40;

const availableToAdd = computed(() =>
  availableAccommodations.value.filter(
    (a) => !vesselAccommodations.value.some((v) => v.name === a.name),
  ),
);

const initAccommodations = () => {
  vesselAccommodations.value = (props.vessel.classes || []).map((cls) => ({
    id: cls.accommodationId,
    name: cls.accommodationName,
    aircon: cls.aircon,
    wifi: cls.wifi,
    rows: cls.rows,
    columns: cls.columns,
    seats: [],
    facilityLabels: cls.facilityLabels || [],
  }));
};

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

const computedFacilityLabels = computed(() =>
  seatmapPreview.value?.seats
    ? recomputeFacilityLabels(seatmapPreview.value.seats)
    : [],
);

const fetchAvailableAccommodations = async () => {
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
      availableAccommodations.value = data.data.map((a) => ({
        id: a.accommodation_id,
        name: a.accommodation_name,
        aircon: a.aircon ?? true,
        wifi: a.wifi ?? false,
      }));
    }
  } catch (err) {
    console.error("Failed to fetch accommodations", err);
  }
};

const fetchSeatmapPreview = async (accName) => {
  isPreviewLoading.value = true;
  seatmapPreview.value = null;
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
    const data = await res.json();
    if (res.ok && data.classes) {
      seatmapPreview.value =
        data.classes.find(
          (c) => (c.name || c.accommodation_name) === accName,
        ) || null;
    }
  } catch (err) {
    console.error("Failed to fetch seatmap preview", err);
  } finally {
    isPreviewLoading.value = false;
  }
};

const selectAccommodation = (acc) => {
  selectedAccommodation.value = acc;
  fetchSeatmapPreview(acc.name);
};

const addAccommodation = () => {
  if (!selectedNewAccommodation.value) return;
  const acc = availableAccommodations.value.find(
    (a) => a.id === selectedNewAccommodation.value,
  );
  if (!acc) return;
  vesselAccommodations.value.push({
    id: acc.id,
    name: acc.name,
    aircon: acc.aircon,
    wifi: acc.wifi,
    rows: null,
    columns: null,
    seats: [],
    facilityLabels: [],
  });
  selectedNewAccommodation.value = null;
  isAddingOpen.value = false;
};

const removeAccommodation = (index) => {
  if (vesselAccommodations.value[index] === selectedAccommodation.value) {
    selectedAccommodation.value = null;
    seatmapPreview.value = null;
  }
  vesselAccommodations.value.splice(index, 1);
};

const saveChanges = async () => {
  isSaving.value = true;
  errorMsg.value = "";
  try {
    const payload = {
      accommodations: vesselAccommodations.value.map((a) => ({
        accommodation_id: a.id,
        aircon: a.aircon,
        wifi: a.wifi,
      })),
    };

    const res = await fetch(
      `${apiBase}/vessels/${props.vessel.vesselId}/accommodations`,
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
      errorMsg.value = data.message || "Failed to save changes.";
      return;
    }
    emit("saved");
  } catch (err) {
    console.error("Failed to save accommodation changes", err);
    errorMsg.value = "Something went wrong.";
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  initAccommodations();
  fetchAvailableAccommodations();
});
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-[1750px] mx-4">
      <!-- Header -->
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <div>
          <h2 class="text-lg font-semibold text-gray-900">
            {{ vessel.vesselName }} — Accommodations
          </h2>
          <p class="text-sm text-gray-500 mt-0.5">
            Manage accommodations and view seatmap previews
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
      <div class="grid grid-cols-[0.6fr_1.5fr] divide-x divide-gray-200">
        <!-- LEFT: Accommodation List -->
        <div class="p-6 flex flex-col gap-4 max-h-[500px] overflow-y-auto">
          <p class="text-sm font-medium text-gray-700">Accommodations</p>

          <!-- List -->
          <div class="space-y-2">
            <div
              v-for="(acc, i) in vesselAccommodations"
              :key="i"
              :class="[
                'flex flex-col p-3 rounded-lg border cursor-pointer transition-colors',
                selectedAccommodation?.name === acc.name
                  ? 'bg-blue-50 border-blue-300'
                  : 'border-gray-200 hover:bg-gray-50',
              ]"
              @click="selectAccommodation(acc)"
            >
              <!-- Name row -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <ChevronRight
                    :class="[
                      'w-4 h-4 transition-transform',
                      selectedAccommodation?.name === acc.name
                        ? 'text-blue-500 rotate-90'
                        : 'text-gray-400',
                    ]"
                  />
                  <span class="text-sm font-medium text-gray-800">{{
                    acc.name
                  }}</span>
                </div>
                <button
                  type="button"
                  @click.stop="removeAccommodation(i)"
                  class="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>

              <!-- Aircon + Wifi toggles -->
              <div class="flex items-center gap-4 mt-2 pl-6">
                <!-- Aircon -->
                <label
                  class="flex items-center gap-1.5 cursor-pointer select-none"
                >
                  <AirVent class="w-3.5 h-3.5 text-gray-500" />
                  <span class="text-xs text-gray-600">AC</span>
                  <button
                    type="button"
                    @click.stop="acc.aircon = !acc.aircon"
                    :class="[
                      'relative inline-flex items-center w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0',
                      acc.aircon ? 'bg-blue-500' : 'bg-gray-300',
                    ]"
                  >
                    <span
                      :class="[
                        'absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200',
                        acc.aircon ? 'translate-x-4' : 'translate-x-0',
                      ]"
                    />
                  </button>
                </label>

                <!-- Wifi -->
                <label
                  class="flex items-center gap-1.5 cursor-pointer select-none"
                >
                  <Wifi class="w-3.5 h-3.5 text-gray-500" />
                  <span class="text-xs text-gray-600">WiFi</span>
                  <button
                    type="button"
                    @click.stop="acc.wifi = !acc.wifi"
                    :class="[
                      'relative inline-flex items-center w-8 h-4 rounded-full transition-colors duration-200 flex-shrink-0',
                      acc.wifi ? 'bg-blue-500' : 'bg-gray-300',
                    ]"
                  >
                    <span
                      :class="[
                        'absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200',
                        acc.wifi ? 'translate-x-4' : 'translate-x-0',
                      ]"
                    />
                  </button>
                </label>
              </div>
            </div>

            <div
              v-if="vesselAccommodations.length === 0"
              class="text-sm text-gray-400 text-center py-4"
            >
              No accommodations added yet.
            </div>
          </div>

          <!-- Add accommodation -->
          <div class="mt-auto pt-2">
            <div v-if="isAddingOpen" class="flex flex-col gap-2">
              <select
                v-model="selectedNewAccommodation"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="" disabled>Select accommodation</option>
                <option v-for="a in availableToAdd" :key="a.id" :value="a.id">
                  {{ a.name }}
                </option>
              </select>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="isAddingOpen = false"
                  class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="addAccommodation"
                  :disabled="!selectedNewAccommodation"
                  class="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
            <button
              v-else
              type="button"
              @click="isAddingOpen = true"
              class="w-full px-4 py-2 text-sm border-2 border-dashed border-blue-300 rounded-md text-blue-600 hover:bg-blue-200 hover:border-blue-400 hover:text-gray-800 transition-colors"
            >
              + Add Accommodation
            </button>
          </div>
        </div>

        <!-- RIGHT: Seatmap Preview -->
        <div class="p-6 bg-gray-50 flex flex-col">
          <p class="text-sm font-medium text-gray-700 mb-4">Seatmap Preview</p>

          <!-- No selection -->
          <div
            v-if="!selectedAccommodation"
            class="flex-1 flex items-center justify-center text-sm text-gray-400"
          >
            Select an accommodation to preview its seatmap
          </div>

          <!-- Loading -->
          <div
            v-else-if="isPreviewLoading"
            class="flex-1 flex items-center justify-center"
          >
            <span
              class="inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
            ></span>
          </div>

          <!-- No seatmap yet -->
          <div
            v-else-if="!seatmapPreview || !seatmapPreview.seats?.length"
            class="flex-1 flex flex-col items-center justify-center gap-2 text-sm text-gray-400"
          >
            <span>No seatmap created yet for</span>
            <span class="font-medium text-gray-600">{{
              selectedAccommodation.name
            }}</span>
          </div>

          <!-- Seatmap grid -->
          <div v-else class="flex-1overflow-auto">
            <p class="text-xs text-center text-gray-500 mb-3 font-medium">
              {{ selectedAccommodation.name }}
            </p>
            <div class="overflow-auto">
              <div
                class="relative"
                :style="{
                  width: seatmapPreview.columns * seatSize + 'px',
                  height: seatmapPreview.rows * seatSize + 'px',
                  minWidth: '100%',
                }"
              >
                <!-- Seats -->
                <div
                  v-for="seat in seatmapPreview.seats"
                  :key="seat.seat_no"
                  class="absolute flex items-center justify-center border rounded text-center pointer-events-none select-none"
                  :style="{
                    width: seatSize + 'px',
                    height: seatSize + 'px',
                    top: seat.row * seatSize + 'px',
                    left: seat.col * seatSize + 'px',
                    fontSize: '15px',
                  }"
                  :class="{
                    'bg-gray-300 border-gray-400': seat.path,
                    'bg-red-600 border-red-700': seat.blocked,
                    'bg-orange-400 border-orange-500': seat.facility,
                    'bg-green-400 border-green-500': seat.pwd,
                    'bg-white border-gray-200':
                      !seat.path &&
                      !seat.blocked &&
                      !seat.facility &&
                      !seat.pwd,
                  }"
                >
                  <span
                    v-if="!seat.blocked && !seat.path && !seat.facility"
                    class="text-gray-600"
                  >
                    {{ seat.seat_no }}
                  </span>
                  <span v-if="seat.blocked" class="text-white font-bold text-xs"
                    >✕</span
                  >
                </div>

                <!-- Facility labels -->
                <div
                  v-for="(f, i) in computedFacilityLabels"
                  :key="i"
                  class="absolute flex items-center justify-center text-white font-bold pointer-events-none bg-orange-500 rounded"
                  :style="{
                    top: f.top + 'px',
                    left: f.left + 'px',
                    width: f.width + 'px',
                    height: f.height + 'px',
                    fontSize: '9px',
                    zIndex: 10,
                  }"
                >
                  {{ f.name }}
                </div>
              </div>
            </div>

            <!-- Legend -->
            <div
              class="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-200"
            >
              <div class="flex items-center gap-1.5">
                <span
                  class="w-3 h-3 rounded bg-white border border-gray-300 flex-shrink-0"
                ></span>
                <span class="text-xs text-gray-500">Available</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded bg-red-600 flex-shrink-0"></span>
                <span class="text-xs text-gray-500">Blocked</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded bg-gray-300 flex-shrink-0"></span>
                <span class="text-xs text-gray-500">Path</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded bg-green-400 flex-shrink-0"></span>
                <span class="text-xs text-gray-500">PWD</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span
                  class="w-3 h-3 rounded bg-orange-400 flex-shrink-0"
                ></span>
                <span class="text-xs text-gray-500">Facility</span>
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
          type="button"
          @click="saveChanges"
          :disabled="isSaving"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isSaving" class="flex items-center gap-2">
            <span
              class="inline-block w-4 h-4 rounded-full border-4 border-white border-t-transparent animate-spin"
            ></span>
            Saving...
          </span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </div>
  </div>
</template>
