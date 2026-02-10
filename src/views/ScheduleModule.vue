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
import ModalScheduleOptions from "../components/ModalScheduleOptions.vue";

const apiBase = import.meta.env.VITE_API_URL;
const activeTab = ref("all");
const searchQuery = ref("");
const isTableLoading = ref(false);
const selectedRoute = ref(null);
const vessels = ref([]);

const tabs = [
  { id: "all", name: "All Routes" },
  { id: "active", name: "Active Schedules" },
  { id: "closed", name: "Closed Route" },
];

const routes = ref([]);

const normalizeRouteStatus = (status) => {
  if (!status) return "inactive";
  const s = String(status).toLowerCase();
  return s === "active" ? "active" : "inactive";
};

const getRouteStatus = (route) => {
  if (route?.status) return normalizeRouteStatus(route.status);
  const schedules = [
    ...(route?.portA?.schedules || []),
    ...(route?.portB?.schedules || []),
  ];
  return schedules.some((s) => String(s?.status).toLowerCase() === "active")
    ? "active"
    : "inactive";
};

// Summary cards
const totalSchedules = computed(() =>
  routes.value.reduce(
    (sum, r) =>
      sum +
      (r.portA?.schedules?.length || 0) +
      (r.portB?.schedules?.length || 0),
    0,
  ),
);
const activeSchedules = computed(
  () => routes.value.filter((r) => r.status === "active").length,
);
const closedSchedules = computed(
  () => routes.value.filter((r) => r.status !== "active").length,
);

const filteredRoutes = computed(() => {
  let filtered = routes.value;
  if (activeTab.value === "active")
    filtered = filtered.filter((r) => r.status === "active");
  else if (activeTab.value === "closed")
    filtered = filtered.filter((r) => r.status !== "active");

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter((r) => {
      return (
        r.portA?.port_name?.toLowerCase().includes(q) ||
        r.portB?.port_name?.toLowerCase().includes(q) ||
        r.route_id?.toString().includes(q)
      );
    });
  }
  return filtered;
});

const fetchRoutes = async () => {
  isTableLoading.value = true;
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
        status: getRouteStatus(route),
      }));
      if (selectedRoute.value) {
        const selectedId = String(selectedRoute.value.route_id ?? "");
        const match = routes.value.find(
          (r) => String(r.route_id ?? "") === selectedId,
        );
        selectedRoute.value = match || null;
      }
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

const fetchVessels = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${apiBase}/vessels`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await response.json();
    if (response.ok && data.success && data.data?.vessels) {
      vessels.value = data.data.vessels.map((v) => ({
        id: v.id,
        name: v.vessel_name,
        status: v.status,
      }));
    } else {
      vessels.value = [];
      console.error("Failed to fetch vessels:", data.message || data);
    }
  } catch (err) {
    vessels.value = [];
    console.error("Network error fetching vessels:", err);
  }
};

onMounted(() => {
  fetchRoutes();
  fetchVessels();
});

const selectRoute = async (route) => {
  selectedRoute.value = route;
};

const getVesselName = (vesselId) => {
  if (!vesselId) return "-";
  const vessel = vessels.value.find((v) => v.id === vesselId);
  return vessel ? vessel.name : "-";
};

const handleVesselChange = async (scheduleId, vesselId) => {
  console.log("handleVesselChange called with:", {
    scheduleId,
    vesselId,
    vesselIdType: typeof vesselId,
  });
  const normalizedVesselId =
    vesselId === "" || vesselId === null ? null : Number(vesselId);
  if (normalizedVesselId !== null && Number.isNaN(normalizedVesselId)) {
    console.error("Invalid vessel id:", vesselId);
    return;
  }
  try {
    const token = localStorage.getItem("token");
    const payload = { vessel_id: normalizedVesselId };
    console.log("Request payload:", payload);
    console.log("API endpoint:", `${apiBase}/schedules/${scheduleId}`);

    const response = await fetch(`${apiBase}/schedules/${scheduleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log("Response data:", data);
    if (response.ok && data.success) {
      // Update successful
      await fetchRoutes();
    } else {
      console.error("Failed to update vessel:", data.message || data);
      alert("Failed to update vessel assignment");
    }
  } catch (err) {
    console.error("Network error updating vessel:", err);
    alert("Network error updating vessel assignment");
  }
};

const handleStatusToggle = async (scheduleId, currentStatus) => {
  try {
    const token = localStorage.getItem("token");
    const normalized = String(currentStatus).toLowerCase();
    const newStatus = normalized === "active" ? "inactive" : "active";
    const payload = { status: newStatus };
    console.log("Toggling status:", { scheduleId, currentStatus, newStatus });

    const response = await fetch(`${apiBase}/schedules/${scheduleId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log("Response data:", data);
    if (response.ok && data.success) {
      // Update successful
      await fetchRoutes();
    } else {
      console.error("Failed to update status:", data.message || data);
      alert("Failed to update schedule status");
    }
  } catch (err) {
    console.error("Network error updating status:", err);
    alert("Network error updating schedule status");
  }
};

const isCreateScheduleModalOpen = ref(false);
const isOptionsModalOpen = ref(false);

const modalMode = ref("create");

// Sched modal
const modalRouteId = ref("");
const modalPortASchedules = ref([{ departure: "", arrival: "" }]);
const modalPortBSchedules = ref([{ departure: "", arrival: "" }]);

const openCreateModal = () => {
  modalMode.value = "create";
  modalRouteId.value = "";
  modalPortASchedules.value = [{ departure: "", arrival: "" }];
  modalPortBSchedules.value = [{ departure: "", arrival: "" }];
  isCreateScheduleModalOpen.value = true;
};

const openEditModal = () => {
  if (!selectedRoute.value) return;
  modalMode.value = "edit";
  modalRouteId.value = selectedRoute.value.route_id;
  modalPortASchedules.value = (selectedRoute.value.portA?.schedules || []).map(
    (s) => ({
      sched_id: s.sched_id,
      departure: s.departure_time || "",
      arrival: s.arrival_time || "",
      vessel: s.vessel?.id || s.vessel || "",
    }),
  );
  modalPortBSchedules.value = (selectedRoute.value.portB?.schedules || []).map(
    (s) => ({
      sched_id: s.sched_id,
      departure: s.departure_time || "",
      arrival: s.arrival_time || "",
      vessel: s.vessel?.id || s.vessel || "",
    }),
  );
  isCreateScheduleModalOpen.value = true;
};

const handleSaveSchedule = (scheduleData) => {
  if (selectedRoute.value) {
    fetchRoutes();
  }
};

const handleSaveScheduleOptions = async (scheduleOptions) => {
  try {
    const token = localStorage.getItem("token");

    for (const sched of scheduleOptions.portA) {
      const response = await fetch(`${apiBase}/schedules/${sched.sched_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ visibility: sched.visibility }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to update schedule:", data);
      }
    }

    for (const sched of scheduleOptions.portB) {
      const response = await fetch(`${apiBase}/schedules/${sched.sched_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ visibility: sched.visibility }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to update schedule:", data);
      }
    }

    isOptionsModalOpen.value = false;
    await fetchRoutes();
  } catch (err) {
    console.error("Error saving schedule options:", err);
    alert("Failed to save schedule options");
  }
};
</script>

<template>
  <transition name="modal-fade">
    <ModalCreateSchedule
      v-if="isCreateScheduleModalOpen"
      :routes="routes"
      :selectedRouteId="modalRouteId"
      :portASchedules="modalPortASchedules"
      :portBSchedules="modalPortBSchedules"
      :mode="modalMode"
      @update:selectedRouteId="modalRouteId = $event"
      @close="isCreateScheduleModalOpen = false"
      @save="handleSaveSchedule"
    />
  </transition>
  <transition name="modal-fade">
    <ModalScheduleOptions
      v-if="isOptionsModalOpen && selectedRoute"
      :selectedRoute="selectedRoute"
      @close="isOptionsModalOpen = false"
      @save="handleSaveScheduleOptions"
    />
  </transition>
  <div class="min-h-full bg-gray-50 p-6">
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
          @click="openCreateModal"
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
          <h3 class="text-sm font-medium text-gray-600">Inactive Routes</h3>
          <AlertCircle class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ closedSchedules }}
        </div>
        <p class="text-sm text-gray-500">Total of inactive routes</p>
      </div>
    </div>

    <!-- Tabs -->
    <div
      class="border border-gray-300 mb-2 rounded-lg bg-gray-200 inline-block mb-8"
    >
      <nav class="flex space-x-4 px-2 py-2">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'py-2 px-2  font-medium text-sm rounded-md',
            activeTab === tab.id
              ? 'bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-bold',
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>
    <div class="">
      <!-- List of Route Section -->
      <div class="grid grid-cols-3 gap-6">
        <!-- Left: List of Routes as table -->
        <div class="col-span-1 border border-gray-300 bg-white rounded-lg">
          <div class="px-4 py-3 border-b border-gray-200 mb-4">
            <h2 class="text-lg font-medium text-gray-900">List of Route</h2>
          </div>
          <div class="flex items-center mb-4 py-2 px-4">
            <div class="relative w-full">
              <Search
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search"
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
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
            <div v-else class="overflow-auto max-h-[400px] px-4 py-2">
              <table class="min-w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-l-lg rounded-bl-lg"
                    >
                      #
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Route
                    </th>
                    <th
                      class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-br-lg rounded-tr-lg"
                    >
                      Schedules
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(route, idx) in filteredRoutes"
                    :key="route.route_id"
                    class="hover:bg-gray-50 cursor-pointer"
                    @click="selectRoute(route)"
                    :class="{
                      'bg-blue-50':
                        selectedRoute &&
                        selectedRoute.route_id === route.route_id,
                    }"
                  >
                    <td
                      class="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-bold"
                    >
                      {{ idx + 1 }}
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        :class="
                          selectedRoute &&
                          selectedRoute.route_id === route.route_id
                            ? 'text-blue-600 font-bold underline'
                            : 'text-gray-900'
                        "
                      >
                        {{ route.portA?.port_name }} -
                        {{ route.portB?.port_name }}
                      </span>
                    </td>
                    <td
                      class="px-4 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{
                        (route.portA?.schedules?.length || 0) +
                        (route.portB?.schedules?.length || 0)
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- Right: Schedule Details for selected route -->
        <div class="col-span-2 bg-white rounded-lg border border-gray-200">
          <div
            class="flex justify-between items-center mb-2 px-4 py-3 border-b border-gray-200 mb-4"
          >
            <h2 class="text-lg font-medium text-gray-900">
              {{
                selectedRoute
                  ? (selectedRoute.portA?.port_name || "") +
                    " - " +
                    (selectedRoute.portB?.port_name || "")
                  : "No route selected"
              }}
            </h2>
            <div v-if="selectedRoute" class="flex gap-2">
              <button
                @click="openEditModal"
                class="flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
              >
                <Edit class="w-4 h-4" /> Edit
              </button>
              <button
                @click="isOptionsModalOpen = true"
                class="flex items-center gap-1 text-gray-600 hover:underline text-sm font-medium"
              >
                <List class="w-4 h-4" /> Options
              </button>
            </div>
          </div>
          <div class="rounded-lg p-6 min-h-[200px]">
            <template v-if="selectedRoute">
              <div class="w-full grid grid-cols-2 gap-4">
                <!-- Port A Schedules -->
                <table class="min-w-full bg-white rounded-b-lg">
                  <thead>
                    <tr>
                      <th
                        class="text-sm text-center py-2 border-gray-400 bg-gray-200 rounded-tl-lg rounded-tr-lg"
                        :colspan="3"
                      >
                        {{ selectedRoute.portA?.port_name || "Port A" }}
                      </th>
                    </tr>
                    <tr>
                      <th
                        class="px-4 py-2 text-xs text-gray-500 text-left border-l border-r border-t border-b border-gray-200"
                      >
                        Departure
                      </th>
                      <th
                        class="px-4 py-2 text-xs text-gray-500 text-left border-l border-r border-t border-b border-gray-200"
                      >
                        Vessel
                      </th>
                      <th
                        class="px-4 py-2 text-xs text-gray-500 text-left border-l border-r border-t border-b border-gray-200"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="sched in selectedRoute.portA?.schedules || []"
                      :key="sched.sched_id"
                    >
                      <td
                        class="px-4 py-2 text-sm border-l border-r border-t border-b border-gray-200"
                      >
                        {{ sched.departure_time }}
                      </td>
                      <td
                        class="px-4 py-2 text-sm border-l border-r border-t border-b border-gray-200"
                      >
                        <select
                          :value="sched.vessel?.id ?? ''"
                          @change="
                            handleVesselChange(
                              sched.sched_id,
                              $event.target.value,
                            )
                          "
                          class="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Vessel</option>
                          <option
                            v-for="vessel in vessels"
                            :key="vessel.id"
                            :value="vessel.id"
                          >
                            {{ vessel.name }}
                          </option>
                        </select>
                      </td>
                      <td
                        @click="
                          handleStatusToggle(sched.sched_id, sched.status)
                        "
                        class="px-4 py-2 text-sm capitalize border-l border-r border-t border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                      >
                        <span
                          :class="[
                            'px-2 py-1 rounded-full text-xs font-medium',
                            String(sched.status).toLowerCase() === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800',
                          ]"
                        >
                          {{ sched.status }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="!selectedRoute.portA?.schedules?.length">
                      <td colspan="3" class="text-gray-400 text-center py-2">
                        No schedules
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- Port B Schedules -->
                <table class="min-w-full bg-white rounded-b-lg">
                  <thead>
                    <tr>
                      <th
                        class="text-sm text-center py-2 border-gray-400 bg-gray-200 rounded-tl-lg rounded-tr-lg"
                        :colspan="3"
                      >
                        {{ selectedRoute.portB?.port_name || "Port B" }}
                      </th>
                    </tr>
                    <tr>
                      <th
                        class="px-4 py-2 text-xs text-gray-500 text-left border-l border-r border-t border-b border-gray-200"
                      >
                        Departure
                      </th>
                      <th
                        class="px-4 py-2 text-xs text-gray-500 text-left border-l border-r border-t border-b border-gray-200"
                      >
                        Vessel
                      </th>
                      <th
                        class="px-4 py-2 text-xs text-gray-500 text-left border-l border-r border-t border-b border-gray-200"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="sched in selectedRoute.portB?.schedules || []"
                      :key="sched.sched_id"
                    >
                      <td
                        class="px-4 py-2 text-sm border-l border-r border-t border-b border-gray-200"
                      >
                        {{ sched.departure_time }}
                      </td>
                      <td
                        class="px-4 py-2 text-sm border-l border-r border-t border-b border-gray-200"
                      >
                        <select
                          :value="sched.vessel?.id ?? ''"
                          @change="
                            handleVesselChange(
                              sched.sched_id,
                              $event.target.value,
                            )
                          "
                          class="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Vessel</option>
                          <option
                            v-for="vessel in vessels"
                            :key="vessel.id"
                            :value="vessel.id"
                          >
                            {{ vessel.name }}
                          </option>
                        </select>
                      </td>
                      <td
                        @click="
                          handleStatusToggle(sched.sched_id, sched.status)
                        "
                        class="px-4 py-2 text-sm capitalize border-l border-r border-t border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                      >
                        <span
                          :class="[
                            'px-2 py-1 rounded-full text-xs font-medium',
                            String(sched.status).toLowerCase() === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800',
                          ]"
                        >
                          {{ sched.status }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="!selectedRoute.portB?.schedules?.length">
                      <td colspan="3" class="text-gray-400 text-center py-2">
                        No schedules
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
                <span>No route selected.</span>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
