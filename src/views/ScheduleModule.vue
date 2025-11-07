<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\views\ScheduleModule.vue -->
<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Plus,
  BarChart3,
  AlertCircle,
  Search,
  Edit,
  List,
} from "lucide-vue-next";
import ModalCreateSchedule from "../components/ModalCreateSchedule.vue";
const apiBase = import.meta.env.VITE_API_URL;
const isModalOpen = ref(false);
const activeTab = ref("all");
const searchQuery = ref("");
const isTableLoading = ref(false);
const isScheduleLoading = ref(false);
const selectedRoute = ref(null);
const scheduleData = ref(null);

const modalRouteId = ref("");
const modalPortASchedules = ref([{ departure: "", arrival: "" }]);
const modalPortBSchedules = ref([{ departure: "", arrival: "" }]);
const tabs = [
  { id: "all", name: "All Routes" },
  { id: "active", name: "Active Schedules" },
  { id: "closed", name: "Closed Route" },
];

const routes = ref([]);
const totalSchedules = computed(() =>
  routes.value.reduce((sum, r) => sum + r.schedules, 0)
);
const activeSchedules = computed(
  () => routes.value.filter((r) => r.status === "Active").length
);
const closedSchedules = computed(
  () => routes.value.filter((r) => r.status !== "Active").length
);

const filteredRoutes = computed(() => {
  let filtered = routes.value;
  if (activeTab.value === "active")
    filtered = filtered.filter((r) => r.status === "Active");
  else if (activeTab.value === "closed")
    filtered = filtered.filter((r) => r.status !== "Active");

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter((r) => r.route_name.toLowerCase().includes(q));
  }
  return filtered;
});

const fetchRoutes = async () => {
  isTableLoading.value = true;
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
        schedules: route.schedules_count || 0,
        status: route.status || "Active",
      }));
    } else {
      routes.value = [];
      console.error("Failed to fetch routes:", data.message || data);
    }
  } catch (err) {
    routes.value = [];
    console.error("Network error fetching routes:", err);
  } finally {
    isTableLoading.value = false;
  }
};

const fetchScheduleForRoute = async (route) => {
  selectedRoute.value = route;
  scheduleData.value = null;
  isScheduleLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${apiBase}/schedules/${route.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await response.json();
    if (response.ok && data.success && data.data) {
      // Accept both array and single object
      let scheds = data.data.schedules || data.data.schedule || [];
      if (!Array.isArray(scheds)) scheds = [scheds];
      scheduleData.value = scheds;
    } else {
      scheduleData.value = [];
      console.error("Failed to fetch schedule:", data.message || data);
    }
  } catch (err) {
    scheduleData.value = [];
    console.error("Network error fetching schedule:", err);
  } finally {
    isScheduleLoading.value = false;
  }
};

onMounted(fetchRoutes);

const getStatusClass = (status) => {
  if (status === "Active") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

const isCreateScheduleModalOpen = ref(false);

// Sched modal

const handleSaveSchedule = (scheduleData) => {
  if (selectedRoute.value) {
    fetchScheduleForRoute(selectedRoute.value);
  }
};
</script>

<template>
  <ModalCreateSchedule
    v-if="isCreateScheduleModalOpen"
    :routes="routes"
    :selectedRouteId="modalRouteId"
    :portASchedules="modalPortASchedules"
    :portBSchedules="modalPortBSchedules"
    @update:selectedRouteId="modalRouteId = $event"
    @update:portASchedules="modalPortASchedules = $event"
    @update:portBSchedules="modalPortBSchedules = $event"
    @close="isCreateScheduleModalOpen = false"
    @save="handleSaveSchedule"
  />
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <nav class="text-sm text-gray-500 mb-2">
        <span>Dashboard</span>
        <span class="mx-2">></span>
        <span class="text-gray-900">Schedule Management</span>
      </nav>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">
          Schedule Management
        </h1>
        <button
          @click="isCreateScheduleModalOpen = true"
          type="button"
          class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          Create
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">Total Schedules</h3>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ totalSchedules }}
        </div>
        <p class="text-sm text-gray-500">
          {{ closedSchedules }} closed routes as of today
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">Active Schedules</h3>
          <BarChart3 class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ activeSchedules }}
        </div>
        <p class="text-sm text-gray-500">Across all available routes</p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">Inactive Schedules</h3>
          <AlertCircle class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ closedSchedules }}
        </div>
        <p class="text-sm text-gray-500">Total of inactive schedules</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-lg shadow-sm">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8 px-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- List of Route Section -->
      <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left: List of Routes as table -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">List of Route</h2>
          <div class="flex items-center mb-4">
            <div class="relative w-full">
              <Search
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search"
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
          </div>
          <div>
            <div
              v-if="isTableLoading"
              class="flex justify-center items-center py-8"
            >
              <div
                class="flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg"
              >
                <span
                  class="inline-block w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
                ></span>
                <span class="font-semibold text-blue-700 text-base"
                  >Loading routes...</span
                >
              </div>
            </div>
            <div v-else class="overflow-auto max-h-[400px]">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      #
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Route
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Schedules
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="route in filteredRoutes"
                    :key="route.id"
                    class="hover:bg-gray-50 cursor-pointer"
                    @click="fetchScheduleForRoute(route)"
                    :class="{
                      'bg-blue-50':
                        selectedRoute && selectedRoute.id === route.id,
                    }"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-bold"
                    >
                      {{ route.id }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        :class="
                          selectedRoute && selectedRoute.id === route.id
                            ? 'text-blue-600 font-bold underline'
                            : 'text-gray-900'
                        "
                      >
                        {{ route.route_name }}
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ route.schedules }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- Right: Schedule Details for selected route -->
        <div>
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-medium text-gray-900">
              {{
                selectedRoute ? selectedRoute.route_name : "No port selected"
              }}
            </h2>
            <div v-if="selectedRoute" class="flex gap-2">
              <button
                class="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
              >
                <Edit class="w-4 h-4" /> Edit
              </button>
              <button
                class="flex items-center gap-1 text-gray-600 hover:underline text-sm font-medium"
              >
                <List class="w-4 h-4" /> Options
              </button>
            </div>
          </div>
          <div class="bg-white border rounded-lg p-6 min-h-[200px]">
            <template v-if="isScheduleLoading">
              <div class="flex items-center gap-3 justify-center py-12">
                <span
                  class="inline-block w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
                ></span>
                <span class="font-semibold text-blue-700 text-base"
                  >Loading schedule...</span
                >
              </div>
            </template>
            <template v-else-if="scheduleData && scheduleData.length">
              <div class="w-full grid grid-cols-2 gap-4">
                <table class="min-w-full bg-white rounded-b-lg">
                  <thead>
                    <tr>
                      <th class="text-sm text-center" :colspan="3">
                        {{ selectedRoute?.port_a }}
                      </th>
                    </tr>
                    <tr>
                      <th class="px-4 py-2 text-xs text-gray-500 text-left">
                        Departure
                      </th>
                      <th class="px-4 py-2 text-xs text-gray-500 text-left">
                        Vessel
                      </th>
                      <th class="px-4 py-2 text-xs text-gray-500 text-left">
                        Arrival
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sched, idx) in scheduleData" :key="idx">
                      <td class="px-4 py-2 text-sm">
                        {{ sched.departure_time || sched.departure }}
                      </td>
                      <td class="px-4 py-2 text-sm">
                        {{ sched.vessel }}
                      </td>
                      <td class="px-4 py-2 text-sm">
                        {{ sched.arrival_time || sched.arrival }}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- 2 -->
                <table class="min-w-full bg-white rounded-b-lg">
                  <thead>
                    <tr>
                      <th class="text-sm text-center" :colspan="3">
                        {{ selectedRoute?.port_b }}
                      </th>
                    </tr>
                    <tr>
                      <th class="px-4 py-2 text-xs text-gray-500 text-left">
                        Departure
                      </th>
                      <th class="px-4 py-2 text-xs text-gray-500 text-left">
                        Vessel
                      </th>
                      <th class="px-4 py-2 text-xs text-gray-500 text-left">
                        Arrival
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(sched, idx) in scheduleData" :key="idx">
                      <td class="px-4 py-2 text-sm">
                        {{ sched.departure_time || sched.departure }}
                      </td>
                      <td class="px-4 py-2 text-sm">
                        {{ sched.vessel }}
                      </td>
                      <td class="px-4 py-2 text-sm">
                        {{ sched.arrival_time || sched.arrival }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
            <template v-else>
              <div
                class="flex items-center justify-center h-full text-gray-500"
              >
                <span>No schedule found for this route.</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
