<script setup>
import { ref, computed, onMounted } from "vue";
import Swal from "sweetalert2";

const emit = defineEmits(["close", "save"]);
const apiBase = import.meta.env.VITE_API_URL;
const isLoading = ref(false);
const errorMsg = ref("");
const vessels = ref([]);

const selectedVesselId = ref("");
const selectedScheduleId = ref("");

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
  console.log("Saving VDAR with data");
};

const fetchVesselsWithSched = async () => {
  try {
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
  } catch (err) {
    vessels.value = [];
  }
};

onMounted(() => {
  fetchVesselsWithSched();
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

      <form @submit.prevent="saveVDAR" class="flex flex-col p-6 gap-6">
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
                >Current Schedule</label
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
            v-model="paymentMode"
            class="border border-gray-300 rounded-md px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select Vessel Master</option>
            <option value="Cash">John Doe</option>
            <option value="Credit">Jane Smith</option>
            <option value="Prepaid">Bob Johnson</option>
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
                type="number"
                required
                placeholder="FCM10"
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
                type="number"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Fuel ROB (KL)</label
              >
              <input
                type="number"
                required
                placeholder="FCM10"
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
          <select
            v-model="paymentMode"
            class="border border-gray-300 rounded-md px-3 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>Select Payment Mode</option>
            <option value="Cash">Cash</option>
            <option value="Credit">Credit</option>
            <option value="Prepaid">Prepaid</option>
          </select>
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
                type="number"
                required
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
