<script setup>
import { ref, computed, onMounted } from "vue";
import { Plus, BarChart3, AlertCircle, Search, Eye } from "lucide-vue-next";
import ModalCreateRoute from "../components/Modals/Route/ModalCreateRoute.vue";

const apiBase = import.meta.env.VITE_API_URL;
const isModalOpen = ref(false);
const activeTab = ref("all");
const searchQuery = ref("");
const isTableLoading = ref(false);

const tabs = [
  { id: "all", name: "All Routes" },
  { id: "active", name: "Active Route" },
  { id: "closed", name: "Closed Route" },
];

const routes = ref([]);
const totalRoutes = computed(() => routes.value.length);
const activeRoutes = computed(
  () => routes.value.filter((r) => r.status === "Active").length,
);
const closedRoutes = computed(
  () => routes.value.filter((r) => r.status !== "Active").length,
);

const filteredRoutes = computed(() => {
  let filtered = routes.value;
  if (activeTab.value === "active")
    filtered = filtered.filter((r) => r.status === "Active");
  else if (activeTab.value === "closed")
    filtered = filtered.filter((r) => r.status !== "Active");

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.port_a_name.toLowerCase().includes(q) ||
        r.port_b_name.toLowerCase().includes(q) ||
        r.updated_by.toLowerCase().includes(q),
    );
  }
  return filtered;
});

const getStatusClass = (status) => {
  if (status === "Active") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

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
        port_a_id: route.port_a_id,
        port_b_id: route.port_b_id,
        port_a_name: route.port_a?.port_name || "",
        port_b_name: route.port_b?.port_name || "",
        status: route.status || "Active",
        updated_by: route.port_a?.last_update_by || "Unknown",
        updated_at: route.updated_at ? route.updated_at.slice(0, 10) : "",
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

onMounted(fetchRoutes);

const handleSave = () => {
  isModalOpen.value = false;
  fetchRoutes();
};

const handleAction = (route) => {
  console.log("View route:", route);
};
</script>

<template>
  <div class="min-h-full bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <nav class="text-sm text-gray-500 mb-2">
        <span>Dashboard</span>
        <span class="mx-2">></span>
        <span class="text-gray-900">Routes</span>
      </nav>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Route Management</h1>
        <button
          @click="isModalOpen = true"
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
          <h3 class="text-sm font-medium text-gray-600">Total Routes</h3>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ totalRoutes }}
        </div>
        <p class="text-sm text-gray-500">
          {{ closedRoutes }} closed routes as of today
        </p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">Active Route</h3>
          <BarChart3 class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ activeRoutes }}
        </div>
        <p class="text-sm text-gray-500">Across all available routes</p>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">Inactive Route</h3>
          <AlertCircle class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ closedRoutes }}
        </div>
        <p class="text-sm text-gray-500">Total of inactive routes</p>
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

      <!-- List of Routes Section -->
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium text-gray-900">List of Route</h2>
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search"
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Table Loading Animation -->
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
        <!-- Data Table -->
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
                  Port A
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Port B
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Updated by
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Updated at
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="route in filteredRoutes"
                :key="route.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ route.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ route.port_a_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ route.port_b_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(route.status)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ route.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ route.updated_by }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ route.updated_at }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="handleAction(route)"
                    class="font-medium text-blue-600 hover:text-blue-900 flex items-center"
                  >
                    <Eye class="w-4 h-4 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <transition name="modal-fade">
      <ModalCreateRoute
        v-if="isModalOpen"
        @close="isModalOpen = false"
        @save="handleSave"
      />
    </transition>
  </div>
</template>
