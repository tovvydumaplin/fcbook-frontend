<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\ModalCreateSchedule.vue -->
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
      <h2 class="text-xl font-semibold text-gray-900 mb-1">{{ mode === 'edit' ? 'Edit Schedule' : 'Create Schedule' }}</h2>
      <p class="text-sm text-gray-500 mb-6">
        {{ mode === 'edit' ? 'Modify the schedule below and save changes' : 'Provide basic information about the schedule' }}
      </p>
      <!-- Route Select -->
      <div class="flex items-center gap-2 mb-6">
        <select
          v-model="selectedRouteId"
          class="border border-gray-300 rounded-md px-3 py-2 w-full max-w-xs"
        >
          <option value="" disabled>Select Route</option>
          <option
            v-for="route in routes"
            :key="route.route_id"
            :value="route.route_id"
          >
            {{ route.portA?.port_name }} - {{ route.portB?.port_name }}
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
            {{ selectedRoute.portA?.port_name || "Port A" }}
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in localPortASchedules" :key="idx">
                <td class="px-4 py-2">
                  <input
                    v-model="row.departure"
                    type="text"
                    placeholder="Departure"
                    :disabled="row.existing"
                    class="border border-gray-300 rounded px-2 py-1 w-full disabled:bg-gray-100"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model="row.arrival"
                    type="text"
                    placeholder="Arrival"
                    :disabled="row.existing"
                    class="border border-gray-300 rounded px-2 py-1 w-full disabled:bg-gray-100"
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
            {{ selectedRoute.portB?.port_name || "Port B" }}
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in localPortBSchedules" :key="idx">
                <td class="px-4 py-2">
                  <input
                    v-model="row.departure"
                    type="text"
                    placeholder="Departure"
                    :disabled="row.existing"
                    class="border border-gray-300 rounded px-2 py-1 w-full disabled:bg-gray-100"
                  />
                </td>
                <td class="px-4 py-2">
                  <input
                    v-model="row.arrival"
                    type="text"
                    placeholder="Arrival"
                    :disabled="row.existing"
                    class="border border-gray-300 rounded px-2 py-1 w-full disabled:bg-gray-100"
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
          {{ mode === 'edit' ? 'Save Changes' : 'Save Schedule' }}
        </button>
      </div>
    </div>
  </div>
</template>

<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\components\ModalCreateSchedule.vue -->
<script setup>
import { ref, computed, watch, onMounted } from "vue";

const props = defineProps({
  routes: { type: Array, default: () => [] },
  selectedRouteId: { type: [String, Number], default: "" },
  portASchedules: { type: Array, default: () => [] },
  portBSchedules: { type: Array, default: () => [] },
  mode: { type: String, default: "create" },
});

const emit = defineEmits([
  "close",
  "save",
  "update:selectedRouteId",
]);
const apiBase = import.meta.env.VITE_API_URL;

const routes = ref(props.routes || []);
watch(() => props.routes, (v) => (routes.value = v || []));

const mode = props.mode || "create";

const selectedRouteId = ref(props.selectedRouteId || "");
watch(
  () => props.selectedRouteId,
  (v) => (selectedRouteId.value = v || ""),
);
watch(selectedRouteId, (v) => emit("update:selectedRouteId", v));

const selectedRoute = computed(() =>
  routes.value.find((r) => r.route_id == selectedRouteId.value),
);

const buildExistingRows = (schedules) =>
  (schedules || []).map((s) => ({
    sched_id: s.sched_id,
    departure: s.departure_time || "",
    arrival: s.arrival_time || "",
    existing: true,
  }));

const localPortASchedules = ref(
  props.portASchedules && props.portASchedules.length
    ? JSON.parse(JSON.stringify(props.portASchedules))
    : [{ departure: "", arrival: "", vessel: "" }],
);
const localPortBSchedules = ref(
  props.portBSchedules && props.portBSchedules.length
    ? JSON.parse(JSON.stringify(props.portBSchedules))
    : [{ departure: "", arrival: "", vessel: "" }],
);

const isSyncingFromRoute = ref(false);

watch(
  () => props.portASchedules,
  (v) => (localPortASchedules.value = JSON.parse(JSON.stringify(v || []))),
);
watch(
  () => props.portBSchedules,
  (v) => (localPortBSchedules.value = JSON.parse(JSON.stringify(v || []))),
);

watch(
  selectedRoute,
  (route) => {
    if (!route || mode !== "create") return;
    const existingA = buildExistingRows(route.portA?.schedules);
    const existingB = buildExistingRows(route.portB?.schedules);
    isSyncingFromRoute.value = true;
    localPortASchedules.value = existingA.length
      ? [...existingA, { departure: "", arrival: "", vessel: "" }]
      : [{ departure: "", arrival: "", vessel: "" }];
    localPortBSchedules.value = existingB.length
      ? [...existingB, { departure: "", arrival: "", vessel: "" }]
      : [{ departure: "", arrival: "", vessel: "" }];
    isSyncingFromRoute.value = false;
  },
  { immediate: true },
);


const addRow = (port) => {
  if (port === "a")
    localPortASchedules.value.push({ departure: "", arrival: "", vessel: "" });
  else localPortBSchedules.value.push({ departure: "", arrival: "", vessel: "" });
};

const fetchRoutes = async () => {
  if (routes.value && routes.value.length) return;
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${apiBase}/routes/with-schedules`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await response.json();
    if (response.ok && data.success && data.data?.routes) {
      routes.value = data.data.routes.map((route) => ({
        route_id: route.route_id,
        portA: route.portA,
        portB: route.portB,
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
  // ensure we have selectedRoute
  if (!selectedRoute.value) {
    alert("Select a route before saving");
    return;
  }

  // Helper to POST new schedule
  const postSchedule = async (payload) => {
    await fetch(`${apiBase}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
  };

  // Helper to PUT update schedule when sched_id is present
  const putSchedule = async (schedId, payload) => {
    await fetch(`${apiBase}/schedules/${schedId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
  };

  // Port A
  for (const row of localPortASchedules.value) {
    if (row.existing) continue;
    if (!row.departure) continue;
    const payload = {
      departure_time: row.departure,
      arrival_time: row.arrival || null,
      port_id: selectedRoute.value.portA.port_id,
    };
    if (mode === "edit" && row.sched_id) {
      await putSchedule(row.sched_id, payload);
    } else {
      await postSchedule(payload);
    }
  }

  // Port B
  for (const row of localPortBSchedules.value) {
    if (row.existing) continue;
    if (!row.departure) continue;
    const payload = {
      departure_time: row.departure,
      arrival_time: row.arrival || null,
      port_id: selectedRoute.value.portB.port_id,
    };
    if (mode === "edit" && row.sched_id) {
      await putSchedule(row.sched_id, payload);
    } else {
      await postSchedule(payload);
    }
  }

  emit("save");
  emit("close");
};
</script>
