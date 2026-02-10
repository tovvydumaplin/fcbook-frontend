<template>
  <div
    class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="modal-card bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 p-6 relative max-h-[85vh] overflow-hidden flex flex-col"
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

// Convert visibility value to checkbox states
const visibilityToCheckboxes = (visibility) => {
  // Default to all (7) if not provided
  const vis = visibility ?? 7;

  return {
    online: [1, 3, 5, 7].includes(vis),
    teller: [2, 3, 6, 7].includes(vis),
    merchant: [4, 5, 6, 7].includes(vis),
    all: vis === 7,
  };
};

// Convert checkbox states to visibility value
const checkboxesToVisibility = (online, teller, merchant) => {
  console.log("checkboxesToVisibility called:", { online, teller, merchant });
  if (online && teller && merchant) return 7; // All
  if (teller && merchant) return 6; // Merchant/Walk-in
  if (online && merchant) return 5; // Online/Merchant
  if (merchant) return 4; // Merchant only
  if (online && teller) return 3; // Online/Walk-in
  if (teller) return 2; // Walk-in only
  if (online) return 1; // Online only
  return 0; // None
};

// Initialize schedules with option flags
const portASchedules = ref([]);
const portBSchedules = ref([]);

// Watch for selectedRoute changes and initialize schedules
watch(
  () => props.selectedRoute,
  (newRoute) => {
    if (newRoute) {
      // Initialize Port A schedules
      portASchedules.value = (newRoute.portA?.schedules || []).map((sched) => {
        console.log(
          "Port A schedule:",
          sched.sched_id,
          "visibility:",
          sched.visibility,
        );
        const checkboxes = visibilityToCheckboxes(sched.visibility);
        return {
          sched_id: sched.sched_id,
          departure_time: sched.departure_time,
          arrival_time: sched.arrival_time,
          visibility: sched.visibility ?? 7,
          ...checkboxes,
        };
      });

      // Initialize Port B schedules
      portBSchedules.value = (newRoute.portB?.schedules || []).map((sched) => {
        console.log(
          "Port B schedule:",
          sched.sched_id,
          "visibility:",
          sched.visibility,
        );
        const checkboxes = visibilityToCheckboxes(sched.visibility);
        return {
          sched_id: sched.sched_id,
          departure_time: sched.departure_time,
          arrival_time: sched.arrival_time,
          visibility: sched.visibility ?? 7,
          ...checkboxes,
        };
      });
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
    schedule.visibility = 7;
  } else {
    // If "All" is unchecked, uncheck all options
    schedule.online = false;
    schedule.teller = false;
    schedule.merchant = false;
    schedule.visibility = 0;
  }
};

// Update "All" checkbox and visibility based on individual options
const updateAllCheckbox = (schedule) => {
  // Update visibility based on current checkbox states
  schedule.visibility = checkboxesToVisibility(
    schedule.online,
    schedule.teller,
    schedule.merchant,
  );

  console.log("Updated visibility:", {
    sched_id: schedule.sched_id,
    online: schedule.online,
    teller: schedule.teller,
    merchant: schedule.merchant,
    visibility: schedule.visibility,
  });

  // Update "All" checkbox if all three are checked
  schedule.all = schedule.online && schedule.teller && schedule.merchant;
};

const handleSave = () => {
  const scheduleOptions = {
    route_id: props.selectedRoute.route_id,
    portA: portASchedules.value.map((sched) => ({
      sched_id: sched.sched_id,
      visibility: sched.visibility,
    })),
    portB: portBSchedules.value.map((sched) => ({
      sched_id: sched.sched_id,
      visibility: sched.visibility,
    })),
  };

  emit("save", scheduleOptions);
};
</script>
