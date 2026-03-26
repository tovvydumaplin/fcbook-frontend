<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["close", "save"]);
const apiBase = import.meta.env.VITE_API_URL;
const isLoading = ref(false);

const props = defineProps({
  selectedRoute: { type: Object, required: true },
});

const apiFetch = async (path, options = {}) => {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...options.headers,
    },
  });
  return response;
};

const buildRows = (schedules) => [
  ...(schedules || []).map((s) => ({
    sched_id: s.sched_id,
    departure: s.departure_time || "",
    arrival: s.arrival_time || "",
    existing: true,
  })),
  { departure: "", arrival: "", existing: false },
];

const portASchedules = ref(buildRows(props.selectedRoute.portA?.schedules));
const portBSchedules = ref(buildRows(props.selectedRoute.portB?.schedules));

// Rebuild rows if the route prop changes
watch(
  () => props.selectedRoute,
  (route) => {
    portASchedules.value = buildRows(route.portA?.schedules);
    portBSchedules.value = buildRows(route.portB?.schedules);
  },
);

const addRow = (port) => {
  if (port === "a")
    portASchedules.value.push({ departure: "", arrival: "", existing: false });
  else
    portBSchedules.value.push({ departure: "", arrival: "", existing: false });
};

const saveSchedule = async () => {
  isLoading.value = true;
  try {
    for (const row of portASchedules.value) {
      if (row.existing || !row.departure) continue;
      if (row.sched_id) {
        await apiFetch(`/schedules/${row.sched_id}`, {
          method: "PUT",
          body: JSON.stringify({
            departure_time: row.departure,
            arrival_time: row.arrival || null,
          }),
        });
      } else {
        await apiFetch("/schedules", {
          method: "POST",
          body: JSON.stringify({
            departure_time: row.departure,
            arrival_time: row.arrival || null,
            port_id: props.selectedRoute.portA.port_id,
          }),
        });
      }
    }

    for (const row of portBSchedules.value) {
      if (row.existing || !row.departure) continue;
      if (row.sched_id) {
        await apiFetch(`/schedules/${row.sched_id}`, {
          method: "PUT",
          body: JSON.stringify({
            departure_time: row.departure,
            arrival_time: row.arrival || null,
          }),
        });
      } else {
        await apiFetch("/schedules", {
          method: "POST",
          body: JSON.stringify({
            departure_time: row.departure,
            arrival_time: row.arrival || null,
            port_id: props.selectedRoute.portB.port_id,
          }),
        });
      }
    }

    emit("save");
    emit("close");
  } catch (err) {
    console.error("Error saving schedule:", err);
    alert("Failed to save changes");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 p-8 relative"
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

      <h2 class="text-xl font-semibold text-gray-900 mb-1">Edit Schedule</h2>
      <p class="text-sm text-gray-500 mb-6">
        {{ selectedRoute.portA?.port_name }} -
        {{ selectedRoute.portB?.port_name }}
      </p>

      <!-- Schedule Tables -->
      <div class="grid grid-cols-2 gap-6 mb-6">
        <!-- Port A -->
        <div>
          <div
            class="bg-gray-100 rounded-t-lg px-4 py-2 font-semibold text-gray-700 text-center"
          >
            {{ selectedRoute.portA?.port_name || "Port A" }}
          </div>
          <table class="min-w-full bg-white rounded-b-lg">
            <thead>
              <tr>
                <th class="px-4 py-2 text-lg text-gray-500 text-center">
                  Departure
                </th>
                <th class="px-4 py-2 text-lg text-gray-500 text-center">
                  Arrival
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

        <!-- Port B -->
        <div>
          <div
            class="bg-gray-100 rounded-t-lg px-4 py-2 font-semibold text-gray-700 text-center"
          >
            {{ selectedRoute.portB?.port_name || "Port B" }}
          </div>
          <table class="min-w-full bg-white rounded-b-lg">
            <thead>
              <tr>
                <th class="px-4 py-2 text-lg text-gray-500 text-center">
                  Departure
                </th>
                <th class="px-4 py-2 text-lg text-gray-500 text-center">
                  Arrival
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

      <!-- Footer -->
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
          :disabled="isLoading"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span
            v-if="isLoading"
            class="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"
          ></span>
          {{ isLoading ? "Saving..." : "Save Changes" }}
        </button>
      </div>
    </div>
  </div>
</template>
