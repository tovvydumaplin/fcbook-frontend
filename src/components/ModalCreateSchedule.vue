<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\ModalCreateSchedule.vue -->
<template>
  <div
    class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-8 relative"
    >
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
      <h2 class="text-xl font-semibold text-gray-900 mb-1">Create Schedule</h2>
      <p class="text-sm text-gray-500 mb-6">
        Provide basic information about the schedule
      </p>
      <!-- Route Select -->
      <div class="flex items-center gap-2 mb-6">
        <select
          v-model="selectedRouteId"
          class="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs"
        >
          <option value="" disabled>Select Route</option>
          <option v-for="route in routes" :key="route.id" :value="route.id">
            {{ route.route_name }}
          </option>
        </select>
        <button
          type="button"
          class="flex items-center gap-1 px-3 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          View
        </button>
      </div>
      <!-- Editable Tables -->
      <div v-if="selectedRoute" class="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div
            class="bg-gray-100 rounded-t-lg px-4 py-2 font-semibold text-gray-700 text-center"
          >
            {{ selectedRoute.port_a }}
          </div>
          <table class="min-w-full bg-white rounded-b-lg">
            <thead>
              <tr>
                <th class="px-4 py-2 text-xs text-gray-500 text-left">
                  Departure
                </th>
                <th class="px-4 py-2 text-xs text-gray-500 text-left">
                  Arrival
                </th>
                <th class="px-4 py-2 text-xs text-gray-500 text-left">
                  Vessel
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in portASchedules" :key="idx">
                <td class="px-4 py-2">
                  <input
                    v-model="row.departure"
                    type="text"
                    placeholder="Departure"
                    class="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model="row.arrival"
                    type="text"
                    placeholder="Arrival"
                    class="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model="row.vessel"
                    type="text"
                    placeholder="Vessel"
                    class="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button
            type="button"
            @click="addRow('a')"
            class="mt-2 text-blue-600 flex items-center gap-1 text-sm hover:underline"
          >
            <span class="font-bold text-lg">+</span> Add row
          </button>
        </div>
        <div>
          <div
            class="bg-gray-100 rounded-t-lg px-4 py-2 font-semibold text-gray-700 text-center"
          >
            {{ selectedRoute.port_b }}
          </div>
          <table class="min-w-full bg-white rounded-b-lg">
            <thead>
              <tr>
                <th class="px-4 py-2 text-xs text-gray-500 text-left">
                  Departure
                </th>
                <th class="px-4 py-2 text-xs text-gray-500 text-left">
                  Arrival
                </th>
                <th class="px-4 py-2 text-xs text-gray-500 text-left">
                  Vessel
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in portBSchedules" :key="idx">
                <td class="px-4 py-2">
                  <input
                    v-model="row.departure"
                    type="text"
                    placeholder="Departure"
                    class="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model="row.arrival"
                    type="text"
                    placeholder="Arrival"
                    class="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model="row.vessel"
                    type="text"
                    placeholder="Vessel"
                    class="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button
            type="button"
            @click="addRow('b')"
            class="mt-2 text-blue-600 flex items-center gap-1 text-sm hover:underline"
          >
            <span class="font-bold text-lg">+</span> Add row
          </button>
        </div>
      </div>
      <!-- Modal Footer -->
      <div class="flex items-center justify-end gap-3 mt-8">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="saveSchedule"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Save Schedule
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

const emit = defineEmits(["close", "save"]);
const apiBase = import.meta.env.VITE_API_URL;

const routes = ref([]);
const selectedRouteId = ref("");
const selectedRoute = computed(() =>
  routes.value.find((r) => r.id === selectedRouteId.value)
);

const portASchedules = ref([{ departure: "", arrival: "", vessel: "" }]);
const portBSchedules = ref([{ departure: "", arrival: "", vessel: "" }]);

watch(selectedRouteId, () => {
  // Reset schedules when route changes
  portASchedules.value = [{ departure: "", arrival: "", vessel: "" }];
  portBSchedules.value = [{ departure: "", arrival: "", vessel: "" }];
});

const addRow = (port) => {
  if (port === "a")
    portASchedules.value.push({ departure: "", arrival: "", vessel: "" });
  else portBSchedules.value.push({ departure: "", arrival: "", vessel: "" });
};

const fetchRoutes = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${apiBase}/routes`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await response.json();
    if (response.ok && data.success && data.data?.routes) {
      routes.value = data.data.routes.map((route, idx) => ({
        id: route.route_id || idx + 1,
        route_name: `${route.port_a} - ${route.port_b}`,
        port_a: route.port_a,
        port_b: route.port_b,
      }));
    } else {
      routes.value = [];
    }
  } catch (err) {
    routes.value = [];
  }
};

onMounted(fetchRoutes);

const saveSchedule = async () => {
  const token = localStorage.getItem("token");
  const schedulesToSave = [];

  // Collect schedules from port A
  portASchedules.value.forEach((row) => {
    if (row.departure && row.vessel) {
      schedulesToSave.push({
        route_id: selectedRouteId.value,
        port: selectedRoute.value.port_a,
        departure_time: row.departure,
        arrival_time: row.arrival,
        vessel: row.vessel,
      });
    }
  });

  // Collect schedules from port B
  portBSchedules.value.forEach((row) => {
    if (row.departure && row.vessel) {
      schedulesToSave.push({
        route_id: selectedRouteId.value,
        port: selectedRoute.value.port_b,
        departure_time: row.departure,
        arrival_time: row.arrival,
        vessel: row.vessel,
      });
    }
  });

  // POST each schedule
  for (const sched of schedulesToSave) {
    await fetch(`${apiBase}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(sched),
    });
  }

  emit("save");
  emit("close");
};
</script>
