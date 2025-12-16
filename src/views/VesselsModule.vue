<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\views\VesselsModule.vue -->

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <nav class="text-sm text-gray-500 mb-2">
        <span>Dashboard</span>
        <span class="mx-2">></span>
        <span class="text-gray-900">Vessels</span>
      </nav>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">Vessels Management</h1>
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
          <h3 class="text-sm font-medium text-gray-600">Total Vessels</h3>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">4</div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">Active Vessels</h3>
          <BarChart3 class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">2</div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">Drydock</h3>
          <AlertCircle class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">4</div>
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

      <!-- List of Vessels Section -->
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium text-gray-900">List of Vessels</h2>
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
              >Loading vessels...</span
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
                  Vessel Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Class
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Seats
                </th>

                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aircon
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  WiFi
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Vessel Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- LOADING -->
              <tr v-if="isLoading">
                <td
                  colspan="8"
                  class="px-6 py-6 text-center text-sm text-gray-500"
                >
                  Loading vessels...
                </td>
              </tr>

              <!-- EMPTY -->
              <tr v-else-if="filteredVessels.length === 0">
                <td
                  colspan="8"
                  class="px-6 py-6 text-center text-sm text-gray-500"
                >
                  No vessels found.
                </td>
              </tr>

              <!-- DATA -->
              <tr
                v-else
                v-for="vessel in filteredVessels"
                :key="vessel.id"
                class="hover:bg-gray-50 align-top"
              >
                <!-- ID -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ vessel.id || "-" }}
                </td>

                <!-- Vessel Name -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ vessel.name || "-" }}
                </td>

                <!-- Class Names -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <ul v-if="vessel.classes && vessel.classes.length">
                    <li v-for="(cls, index) in vessel.classes" :key="index">
                      {{ cls.name || "-" }}
                    </li>
                  </ul>
                  <span v-else>-</span>
                </td>

                <!-- Seats -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <ul v-if="vessel.classes && vessel.classes.length">
                    <li v-for="(cls, index) in vessel.classes" :key="index">
                      {{ cls.seats.length }}
                    </li>
                  </ul>
                  <span v-else>-</span>
                </td>

                <!-- Aircon -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <ul v-if="vessel.classes && vessel.classes.length">
                    <li v-for="(cls, index) in vessel.classes" :key="index">
                      <span v-if="cls.aircon === true">✅</span>
                      <span v-else-if="cls.aircon === false">❌</span>
                      <span v-else>-</span>
                    </li>
                  </ul>
                  <span v-else>-</span>
                </td>

                <!-- WiFi -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <ul v-if="vessel.classes && vessel.classes.length">
                    <li v-for="(cls, index) in vessel.classes" :key="index">
                      <span v-if="cls.wifi === true">✅</span>
                      <span v-else-if="cls.wifi === false">❌</span>
                      <span v-else>-</span>
                    </li>
                  </ul>
                  <span v-else>-</span>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="vessel.status"
                    :class="getStatusClass(vessel.status)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ vessel.status }}
                  </span>
                  <span v-else>-</span>
                </td>

                <!-- Action -->
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    @click="openEditModal(vessel)"
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

    <!-- Modal rendered only when open -->
    <ModalCreateVessel
      v-if="isModalOpen"
      :vessel="editVessel || { classes: [] }"
      @close="isModalOpen = false"
      @save="handleSaveVessel"
    />
    <!-- Create Seatmap Modal -->
    <ModalCreateSeatmap
      v-if="showSeatmapModal"
      :seatmap="seatmapData"
      @close="showSeatmapModal = false"
      @save="handleSeatmapSave"
    />
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { Plus, BarChart3, AlertCircle, Search, Eye } from "lucide-vue-next";
import ModalCreateVessel from "../components/ModalCreateVessel.vue";
import ModalCreateSeatmap from "../components/ModalCreateSeatmap.vue";

const apiBase = import.meta.env.VITE_API_URL;
const activeTab = ref("all");
const searchQuery = ref("");
const isTableLoading = ref(false);
const isLoading = ref(false);
const isModalOpen = ref(false);
const showSeatmapModal = ref(false);
const seatmapData = ref(null);
const editVessel = ref(null);
const vessels = ref([]);
const selectedVessel = ref(null);
const tabs = [
  { id: "all", name: "All Vessels" },
  { id: "available", name: "Available Vessels" },
  { id: "drydock", name: "Drydock" },
  { id: "grounded", name: "Grounded" },
];

const fetchVessels = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${apiBase}/vessels`, {
      headers: { "Content-Type": "application/json", Authorization: token },
    });
    const data = await res.json();

    if (res.ok && data.success && data.data?.vessels) {
      vessels.value = await Promise.all(
        data.data.vessels.map(async (v) => {
          const layoutRes = await fetch(`${apiBase}/vessels/${v.id}/layout`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
          const layoutData = await layoutRes.json();

          const classes = (layoutData.classes || []).map((cls) => ({
            name: cls.name,
            aircon: cls.aircon,
            wifi: cls.wifi,
            seats: cls.seats.filter(
              (s) => !s.blocked && !s.path && !s.facility
            ),
          }));

          return {
            id: v.id,
            name: v.vessel_name,
            status: v.status,
            classes,
          };
        })
      );
    } else {
      vessels.value = [];
    }
  } catch (err) {
    vessels.value = [];
    console.error("Failed to fetch vessels", err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchVessels);

const openCreateModal = () => {
  editVessel.value = null;
  isModalOpen.value = true;
};

const openEditModal = (vessel) => {
  if (!vessel.classes) vessel.classes = [];
  editVessel.value = vessel;
  isModalOpen.value = true;
};

const filteredVessels = computed(() => {
  if (activeTab.value === "all") return vessels.value;
  if (activeTab.value === "available")
    return vessels.value.filter((v) => v.status === "Available");
  if (activeTab.value === "drydock")
    return vessels.value.filter((v) => v.status === "Drydock");
  if (activeTab.value === "grounded")
    return vessels.value.filter((v) => v.status === "Grounded");
  return [];
});

const getStatusClass = (status) => {
  if (status === "Available") return "bg-green-100 text-green-800";
  return "bg-gray-100 text-gray-800";
};

const handleSeatmapSave = (seatmapPayload) => {
  if (!selectedVessel.value) return;

  const index = vessels.value.findIndex(
    (v) => v.id === selectedVessel.value.id
  );
  if (index === -1) return;

  vessels.value[index].classes = vessels.value[index].classes.map((cls) => {
    const found = seatmapPayload.classes.find((c) => c.name === cls.name);
    return {
      ...cls,
      rows: found?.rows || cls.rows,
      columns: found?.columns || cls.columns,
      seats: found?.seats || cls.seats,
    };
  });

  showSeatmapModal.value = false;
};
const handleSaveVessel = (vesselData) => {
  // Ensure classes array exists so table shows properly
  const classes = vesselData.classes || [];

  vessels.value.push({
    id: vesselData.id,
    name: vesselData.vessel_name,
    status: vesselData.status,
    classes: [], // no seats yet
  });

  isModalOpen.value = false;
};
</script>
