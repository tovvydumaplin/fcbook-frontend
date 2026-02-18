<!-- filepath: d:\Fastcat Book 2\fcbook-frontend\src\views\VesselsModule.vue -->

<template>
  <div class="min-h-full bg-gray-50 p-6">
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
                <th :class="headerClass">#</th>
                <th :class="headerClass">Vessel Name</th>
                <th :class="headerClass">Class</th>
                <th :class="headerClass">Seats</th>
                <th :class="headerClass">Aircon</th>
                <th :class="headerClass">WiFi</th>
                <th :class="headerClass">Vessel Status</th>
                <th :class="headerClass">Action</th>
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
                <td :class="cellClass">{{ vessel.id || "-" }}</td>
                <td :class="cellClass">{{ vessel.name || "-" }}</td>

                <td :class="cellClass">
                  <ul>
                    <li
                      v-for="(item, idx) in renderClassList(vessel, 'name')"
                      :key="idx"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </td>

                <td :class="cellClass">
                  <ul>
                    <li
                      v-for="(item, idx) in renderClassList(vessel, 'seats')"
                      :key="idx"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </td>

                <td :class="cellClass">
                  <ul>
                    <li
                      v-for="(item, idx) in renderClassList(vessel, 'aircon')"
                      :key="idx"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </td>

                <td :class="cellClass">
                  <ul>
                    <li
                      v-for="(item, idx) in renderClassList(vessel, 'wifi')"
                      :key="idx"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="vessel.status"
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      getStatusClass(vessel.status),
                    ]"
                  >
                    {{ vessel.status }}
                  </span>
                  <span v-else>-</span>
                </td>

                <td :class="cellClass">
                  <div class="flex gap-3 items-center">
                    <button
                      disabled
                      title="not working yet"
                      class="font-medium text-gray-400 flex items-center cursor-not-allowed opacity-60"
                    >
                      <Eye class="w-4 h-4 mr-1" />
                    </button>
                    <button
                      type="button"
                      class="font-medium text-blue-600 hover:text-blue-900 flex items-center cursor-pointer"
                      :disabled="isLoading"
                      @click="openSeatmapModal(vessel)"
                    >
                      <Map class="w-4 h-4 mr-1" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <transition name="modal-fade">
      <ModalCreateVessel
        v-if="modals.createEdit.open"
        @close="modals.createEdit.open = false"
        @save="fetchVessels"
      />
    </transition>

    <transition name="modal-fade">
      <ModalCreateSeatmap
        v-if="modals.seatmap.open"
        :seatmap="modals.seatmap.data"
        @save="handleSeatmapSave"
        @close="modals.seatmap.open = false"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Plus,
  BarChart3,
  AlertCircle,
  Search,
  Eye,
  Map,
} from "lucide-vue-next";
import ModalCreateVessel from "../components/ModalCreateVessel.vue";
import ModalCreateSeatmap from "../components/ModalCreateSeatmap.vue";

const cellClass = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";
const headerClass =
  "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
const apiBase = import.meta.env.VITE_API_URL;
const activeTab = ref("all");
const searchQuery = ref("");
const isTableLoading = ref(false);
const isLoading = ref(false);
const vessels = ref([]);
const isSeatmapLoading = ref(false);

const modals = ref({
  createEdit: { open: false },
  seatmap: { open: false, vessel: null, data: null },
});

const tabs = [
  { id: "all", name: "All Vessels" },
  { id: "available", name: "Available Vessels" },
  { id: "drydock", name: "Drydock" },
  { id: "grounded", name: "Grounded" },
];

// Helpers
const renderClassList = (vessel, field) => {
  if (!vessel.classes || vessel.classes.length === 0) return ["-"];
  return vessel.classes.map((cls) => {
    switch (field) {
      case "aircon":
        return cls.aircon === true ? "✅" : cls.aircon === false ? "❌" : "-";
      case "wifi":
        return cls.wifi === true ? "✅" : cls.wifi === false ? "❌" : "-";
      case "seats":
        return cls.seats || 0;
      case "name":
        return cls.name || "-";
    }
  });
};

const getStatusClass = (status) =>
  status === "Available"
    ? "bg-green-100 text-green-800"
    : "bg-gray-100 text-gray-800";

// API

const fetchVessels = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${apiBase}/vessels`, {
      headers: { "Content-Type": "application/json", Authorization: token },
    });
    const data = await res.json();

    if (res.ok && data.success && data.data?.vessels) {
      vessels.value = data.data.vessels.map((v) => ({
        id: v.id,
        name: v.name,
        status: v.status,

        classes: v.accommodations.map((a) => ({
          name: a.name || "Unknown",
          rows: a.rows || 0,
          columns: a.columns || 0,
          seats: a.seats || 0,
          facilityLabels: a.facilityLabels || [],
          aircon: !!a.aircon,
          wifi: !!a.wifi,
        })),
      }));
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

onMounted(() => {
  fetchVessels();
  // fetchAccommodations();
});

// Modal Handlers
const openCreateModal = () => {
  modals.value.createEdit.vessel = null;
  modals.value.createEdit.open = true;
};

// const openEditModal = (vessel) => {
//   if (!vessel.classes) vessel.classes = [];
//   modals.value.createEdit.vessel = vessel;
//   modals.value.createEdit.open = true;
// };

const openSeatmapModal = async (vessel) => {
  try {
    isSeatmapLoading.value = true; // ONLY for seatmap
    const token = localStorage.getItem("token");
    const res = await fetch(`${apiBase}/vessels/${vessel.id}/layout`, {
      headers: { "Content-Type": "application/json", Authorization: token },
    });
    const data = await res.json();

    modals.value.seatmap.vessel = vessel;
    modals.value.seatmap.data = data.classes || [];
    modals.value.seatmap.open = true;
  } catch (err) {
    console.error("Failed to load seatmap:", err);
    alert("Failed to load seatmap. Please try again.");
  } finally {
    isSeatmapLoading.value = false;
  }
};

// Computed
const statusMap = {
  available: "Available",
  drydock: "Drydock",
  grounded: "Grounded",
};

const filteredVessels = computed(() =>
  activeTab.value === "all"
    ? vessels.value
    : vessels.value.filter((v) => v.status === statusMap[activeTab.value]),
);

// Save seatmap
const handleSeatmapSave = async (payload) => {
  const vessel = modals.value.seatmap.vessel;
  if (!vessel) return;

  try {
    const token = localStorage.getItem("token");

    await fetch(`${apiBase}/vessels/${vessel.id}/layout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });

    modals.value.seatmap.open = false;
    fetchVessels(); // reload table
  } catch (err) {
    console.error("Failed saving seatmap:", err);
    alert("Failed to save seatmap");
  }
};
</script>
