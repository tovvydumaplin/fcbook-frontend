<template>
  <div
    class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 p-6 relative max-h-[85vh] overflow-hidden flex flex-col"
    >
      <!-- Close button -->
      <button
        @click="$emit('close')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
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

      <!-- Header -->
      <h2 class="text-xl font-semibold text-gray-900 mb-6">
        {{ routeName }}
      </h2>

      <!-- Schedule Options Grid -->
      <div class="space-y-6 mb-6 overflow-auto flex-1 pr-1">
        <!-- Port A Section -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Left: Schedule Times -->
          <div
            class="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
          >
            <div
              class="bg-gray-200 px-4 py-3 font-semibold text-gray-700 text-center"
            >
              {{ portAName }}
            </div>
            <table class="min-w-full bg-white">
              <thead>
                <tr class="border-b border-gray-200">
                  <th
                    class="px-6 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    Departure
                  </th>
                  <th
                    class="px-6 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    Arrival
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(schedule, idx) in portASchedules"
                  :key="`portA-time-${idx}`"
                  class="border-b border-gray-200"
                >
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ schedule.departure_time }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ schedule.arrival_time || "N/A" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Right: Options -->
          <div
            class="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
          >
            <div
              class="bg-gray-200 px-4 py-3 font-semibold text-gray-700 text-center"
            >
              Options
            </div>
            <table class="min-w-full bg-white">
              <thead>
                <tr class="border-b border-gray-200">
                  <th
                    class="px-6 py-3 text-center text-sm font-medium text-gray-700"
                  >
                    Online
                  </th>
                  <th
                    class="px-6 py-3 text-center text-sm font-medium text-gray-700"
                  >
                    Teller
                  </th>
                  <th
                    class="px-6 py-3 text-center text-sm font-medium text-gray-700"
                  >
                    Merchant
                  </th>
                  <th
                    class="px-6 py-3 text-center text-sm font-medium text-gray-700"
                  >
                    All
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(schedule, idx) in portASchedules"
                  :key="`portA-opts-${idx}`"
                  class="border-b border-gray-200"
                >
                  <td class="px-6 py-4 text-center">
                    <input
                      v-model="schedule.online"
                      @change="updateAllCheckbox(schedule)"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500"
                    />
                  </td>
                  <td class="px-6 py-4 text-center">
                    <input
                      v-model="schedule.teller"
                      @change="updateAllCheckbox(schedule)"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500"
                    />
                  </td>
                  <td class="px-6 py-4 text-center">
                    <input
                      v-model="schedule.merchant"
                      @change="updateAllCheckbox(schedule)"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500"
                    />
                  </td>
                  <td class="px-6 py-4 text-center">
                    <input
                      v-model="schedule.all"
                      @change="handleAllCheckbox(schedule)"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Port B Section -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Left: Schedule Times -->
          <div
            class="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
          >
            <div
              class="bg-gray-200 px-4 py-3 font-semibold text-gray-700 text-center"
            >
              {{ portBName }}
            </div>
            <table class="min-w-full bg-white">
              <thead>
                <tr class="border-b border-gray-200">
                  <th
                    class="px-6 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    Departure
                  </th>
                  <th
                    class="px-6 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    Arrival
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(schedule, idx) in portBSchedules"
                  :key="`portB-time-${idx}`"
                  class="border-b border-gray-200"
                >
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ schedule.departure_time }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ schedule.arrival_time || "N/A" }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Right: Options -->
          <div
            class="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
          >
            <div
              class="bg-gray-200 px-4 py-3 font-semibold text-gray-700 text-center"
            >
              Options
            </div>
            <table class="min-w-full bg-white">
              <thead>
                <tr class="border-b border-gray-200">
                  <th
                    class="px-6 py-3 text-center text-sm font-medium text-gray-700"
                  >
                    Online
                  </th>
                  <th
                    class="px-6 py-3 text-center text-sm font-medium text-gray-700"
                  >
                    Teller
                  </th>
                  <th
                    class="px-6 py-3 text-center text-sm font-medium text-gray-700"
                  >
                    Merchant
                  </th>
                  <th
                    class="px-6 py-3 text-center text-sm font-medium text-gray-700"
                  >
                    All
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(schedule, idx) in portBSchedules"
                  :key="`portB-opts-${idx}`"
                  class="border-b border-gray-200"
                >
                  <td class="px-6 py-4 text-center">
                    <input
                      v-model="schedule.online"
                      @change="updateAllCheckbox(schedule)"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500"
                    />
                  </td>
                  <td class="px-6 py-4 text-center">
                    <input
                      v-model="schedule.teller"
                      @change="updateAllCheckbox(schedule)"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500"
                    />
                  </td>
                  <td class="px-6 py-4 text-center">
                    <input
                      v-model="schedule.merchant"
                      @change="updateAllCheckbox(schedule)"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500"
                    />
                  </td>
                  <td class="px-6 py-4 text-center">
                    <input
                      v-model="schedule.all"
                      @change="handleAllCheckbox(schedule)"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 border-gray-300 rounded-md focus:ring-blue-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-end gap-3">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          type="button"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
        >
          <svg
            class="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  selectedRoute: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "save"]);

const routeName = computed(() => {
  if (!props.selectedRoute) return "";
  return `${props.selectedRoute.portA?.port_name || ""} - ${props.selectedRoute.portB?.port_name || ""}`;
});

const portAName = computed(
  () => props.selectedRoute.portA?.port_name || "Port A",
);
const portBName = computed(
  () => props.selectedRoute.portB?.port_name || "Port B",
);

// Initialize schedules with option flags
const portASchedules = ref([]);
const portBSchedules = ref([]);

// Watch for selectedRoute changes and initialize schedules
watch(
  () => props.selectedRoute,
  (newRoute) => {
    if (newRoute) {
      // Initialize Port A schedules
      portASchedules.value = (newRoute.portA?.schedules || []).map((sched) => ({
        sched_id: sched.sched_id,
        departure_time: sched.departure_time,
        arrival_time: sched.arrival_time,
        online: sched.online ?? true,
        teller: sched.teller ?? true,
        merchant: sched.merchant ?? true,
        all: sched.all ?? true,
      }));

      // Initialize Port B schedules
      portBSchedules.value = (newRoute.portB?.schedules || []).map((sched) => ({
        sched_id: sched.sched_id,
        departure_time: sched.departure_time,
        arrival_time: sched.arrival_time,
        online: sched.online ?? true,
        teller: sched.teller ?? true,
        merchant: sched.merchant ?? true,
        all: sched.all ?? true,
      }));
    }
  },
  { immediate: true },
);

// Handle when "All" checkbox is clicked
const handleAllCheckbox = (schedule) => {
  if (schedule.all) {
    // If "All" is checked, check all options
    schedule.online = true;
    schedule.teller = true;
    schedule.merchant = true;
  } else {
    // If "All" is unchecked, uncheck all options
    schedule.online = false;
    schedule.teller = false;
    schedule.merchant = false;
  }
};

// Update "All" checkbox based on individual options
const updateAllCheckbox = (schedule) => {
  // Count how many options are checked
  const checkedCount = [
    schedule.online,
    schedule.teller,
    schedule.merchant,
  ].filter(Boolean).length;

  // If all 3 options are checked, check "All"
  // Otherwise, uncheck "All"
  schedule.all = checkedCount === 3;
};

const handleSave = () => {
  const scheduleOptions = {
    route_id: props.selectedRoute.route_id,
    portA: portASchedules.value,
    portB: portBSchedules.value,
  };

  emit("save", scheduleOptions);
};
</script>
