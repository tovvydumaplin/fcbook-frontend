<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";

const emit = defineEmits(["close", "save"]);
const apiBase = import.meta.env.VITE_API_URL;
const isLoading = ref(false);
const isInitialLoading = ref(true);
const errorMsg = ref("");
const vessels = ref([]);
const vesselMasters = ref([]);

const selectedVesselId = ref("");
const selectedScheduleId = ref("");
const selectedVesselMasterId = ref("");
const voyageNumber = ref("");
const recordedSailingSpeed = ref("");
const waterConsumption = ref("");
const fuelRob = ref("");
const reasonOfDelay = ref("");
const actualDepartureTime = ref("");
const actualArrivalTime = ref("");
const ramDisengageTime = ref("");
const undockTime = ref("");

const selectedVessel = computed(
  () =>
    vessels.value.find((v) => v.vesselId === selectedVesselId.value) || null,
);

const availableSchedules = computed(() =>
  selectedVessel.value ? selectedVessel.value.schedules : [],
);

const onVesselChange = () => {
  selectedScheduleId.value = "";
};

const saveVDAR = async () => {
  isLoading.value = true;
  errorMsg.value = "";
  try {
    const toHis = (t) => (t ? `${t}:00` : null);

    const payload = {
      vessel_id: selectedVesselId.value,
      schedule_id: selectedScheduleId.value,
      vessel_master_id: selectedVesselMasterId.value,
      voyage_number: voyageNumber.value,
      recorded_sailing_speed: parseInt(recordedSailingSpeed.value),
      water_consumption: parseInt(waterConsumption.value),
      fuel_rob: parseInt(fuelRob.value),
      reason_of_delay: reasonOfDelay.value || null,
      actual_departure_time: toHis(actualDepartureTime.value),
      actual_arrival_time: toHis(actualArrivalTime.value),
      ram_disengage_time: toHis(ramDisengageTime.value),
      undock_time: undockTime.value ? parseInt(undockTime.value) : null,
    };

    const res = await fetch(`${apiBase}/vdar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      errorMsg.value = data.message || "Failed to create report.";
      return;
    }

    emit("save");
    emit("close");
  } catch (err) {
    errorMsg.value = "An unexpected error occurred.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const fetchVesselsWithSched = async () => {
  const res = await fetch(`${apiBase}/vessels/with-schedules`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  if (res.ok && data.success && data.data?.vessels) {
    vessels.value = data.data.vessels.map((v) => ({
      vesselId: v.id,
      vesselName: v.vessel_name || v.name,
      schedules: v.schedules || [],
    }));
  } else {
    vessels.value = [];
  }
};

const fetchVesselMasters = async () => {
  const res = await fetch(`${apiBase}/account/users/vessel-masters`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  const data = await res.json();
  if (res.ok && data.success && data.data?.vessel_masters) {
    vesselMasters.value = data.data.vessel_masters;
  } else {
    vesselMasters.value = [];
  }
};

onMounted(async () => {
  try {
    await Promise.all([fetchVesselsWithSched(), fetchVesselMasters()]);
  } catch (err) {
    console.error(err);
  } finally {
    isInitialLoading.value = false;
  }
});
</script>

<template>
  <div
    class="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <!-- Top-right Floating Saving Card -->
    <div
      v-if="isLoading"
      class="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg"
    >
      <span
        class="inline-block w-5 h-5 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
      ></span>
      <span class="font-semibold text-blue-700 text-base">Saving data...</span>
    </div>

    <div
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-lg mx-4"
      @click.stop
    >
      <div
        class="flex items-center justify-between p-6 border-b border-gray-200"
      >
        <h2 class="text-lg font-semibold text-gray-900">Create Report</h2>
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

      <!-- Initial loading spinner -->
      <div
        v-if="isInitialLoading"
        class="flex items-center justify-center py-16"
      >
        <span
          class="inline-block w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
        ></span>
      </div>

      <form
        v-else
        @submit.prevent="saveVDAR"
        class="flex flex-col p-6 gap-6"
      >
        <!-- FORM FIELDS -->
        <!-- ROW 1 -->
        <div class="grid grid-cols-2 gap-6">
          <!-- LEFT COLUMN -->
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Vessel</label
              >
              <select
                v-model="selectedVesselId"
                @change="onVesselChange"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select Vessel</option>
                <option
                  v-for="vessel in vessels"
                  :key="vessel.vesselId"
                  :value="vessel.vesselId"
                >
                  {{ vessel.vesselName }}
                </option>
              </select>
            </div>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Trip Schedule</label
              >
              <select
                v-model="selectedScheduleId"
                required
                :disabled="!selectedVesselId || availableSchedules.length === 0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                  {{
                    !selectedVesselId
                      ? "Select a vessel first"
                      : availableSchedules.length === 0
                        ? "No schedules available"
                        : "Select Schedule"
                  }}
                </option>
                <option
                  v-for="schedule in availableSchedules"
                  :key="schedule.sched_id"
                  :value="schedule.sched_id"
                >
                  {{ schedule.departure_time }} → {{ schedule.arrival_time }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <!-- ROW 2 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Vessel Master</label
          >
          <select
            v-model="selectedVesselMasterId"
            required
            class="border border-gray-300 rounded-md px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select Vessel Master</option>
            <option
              v-for="master in vesselMasters"
              :key="master.id"
              :value="master.id"
            >
              {{ master.first_name }} {{ master.last_name }}
            </option>
          </select>
        </div>
        <!-- ROW 3 -->
        <div class="grid grid-cols-2 gap-6">
          <!-- LEFT COLUMN -->
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Voyage Number</label
              >
              <input
                v-model="voyageNumber"
                type="text"
                required
                placeholder="FCM10"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Water Consumption (tons)</label
              >
              <input
                v-model="waterConsumption"
                type="number"
                required
                placeholder="150"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <!-- RIGHT COLUMN -->
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Recorded Sailing Speed (Knots)</label
              >
              <input
                v-model="recordedSailingSpeed"
                type="number"
                required
                placeholder="22"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Fuel ROB (KL)</label
              >
              <input
                v-model="fuelRob"
                type="number"
                required
                placeholder="3200"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <!-- ROW 4 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Reason of Delay</label
          >
          <input
            v-model="reasonOfDelay"
            type="text"
            placeholder="Optional"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <!-- ROW 5 -->
        <div class="grid grid-cols-2 gap-6">
          <!-- LEFT COLUMN -->
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Actual Departure Time</label
              >
              <input
                v-model="actualDepartureTime"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Vessel Last Line/Ram Disengaged</label
              >
              <input
                v-model="ramDisengageTime"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <!-- RIGHT COLUMN -->
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Actual Arrival Time</label
              >
              <input
                v-model="actualArrivalTime"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Maneuver/Undock Time (in mins)</label
              >
              <input
                v-model="undockTime"
                type="number"
                required
                placeholder="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        <!-- Modal Footer -->
        <div
          class="flex items-center justify-end gap-3 pt-6 border-t border-gray-200"
        >
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center gap-2">
              <span
                class="inline-block w-5 h-5 rounded-full border-4 border-white border-t-transparent animate-spin"
              ></span>
              Saving Report...
            </span>
            <span v-else>Save</span>
          </button>
        </div>
        <div v-if="errorMsg" class="text-red-500 text-sm mt-2 text-center">
          {{ errorMsg }}
        </div>
      </form>
    </div>
  </div>
</template>
