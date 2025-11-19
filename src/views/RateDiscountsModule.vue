<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\views\RateDiscountsModule.vue -->
<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Plus,
  BarChart3,
  AlertCircle,
  Search,
  Edit,
  Eye,
  List,
} from "lucide-vue-next";

const apiBase = import.meta.env.VITE_API_URL;
const isModalOpen = ref(false);
const activeTab = ref("all");
const searchQuery = ref("");
const isTableLoading = ref(false);
const selectedRoute = ref(null);
const rateData = ref(null);

const tabs = [
  { id: "all", name: "Rates" },
  { id: "active", name: "Discounts" },
];

const routes = ref([{}]);
const dummyRoutes = [
  {
    id: 1,
    route_name: "Cebu – Tagbilaran",
    accommodations: [
      { id: 1, class_name: "Business Class", rate: 654 },
      { id: 2, class_name: "Premium Economy", rate: 452 },
      { id: 3, class_name: "Economy Class", rate: 351 },
    ],
  },
  {
    id: 2,
    route_name: "Cebu – Ormoc",
    accommodations: [
      { id: 1, class_name: "Business Class", rate: null },
      { id: 2, class_name: "Premium Economy", rate: null },
    ],
  },
  {
    id: 3,
    route_name: "Tagbilaran – Dumaguete",
    accommodations: [
      { id: 3, class_name: "Economy Class", rate: null },
      { id: 4, class_name: "Pets ", rate: null },
    ],
  },
];
const getStatusClass = (status) => {
  if (status === "Active") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};
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
const fetchRateForRoute = async (route) => {
  selectedRoute.value = route;
  rateData.value = null;
};
onMounted(fetchRoutes);
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <nav class="text-sm text-gray-500 mb-2">
        <span>Dashboard</span>
        <span class="mx-2">></span>
        <span class="text-gray-900">Rates/Discounts</span>
      </nav>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">
          Rates/Discounts Management
        </h1>
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
    <div class="grid md:grid-cols-[380px_1fr] gap-6">
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
        <div class="p-6">
          <!-- Left: List of Routes as table -->
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              List of Route
            </h2>
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
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="route in dummyRoutes"
                      :key="route.id"
                      @click="fetchRateForRoute(route)"
                      class="hover:bg-gray-50 cursor-pointer"
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
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Right: Schedule Details for selected route -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="p-6">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-lg font-medium text-gray-900">
              {{
                selectedRoute
                  ? selectedRoute.route_name + " Rate"
                  : "No route Selected"
              }}
            </h2>
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
                    Type name
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Base Rate
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Updated
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Updated by
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Updated Status
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
                  v-for="(acc, index) in selectedRoute?.accommodations || []"
                  :key="acc.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ index + 1 }}
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ acc.class_name }}
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span v-if="acc.rate === null" class="text-red-500"
                      >No rate yet</span
                    >
                    <span v-else>₱{{ acc.rate }}</span>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    —
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    —
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    —
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      @click="handleAction(acc)"
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
      <!-- Right: Schedule Details for selected route ENDS HERE-->
    </div>

    <!-- Modal rendered only when open -->
  </div>
</template>
