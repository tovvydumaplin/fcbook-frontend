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
import ModalCreateVessel from "../components/Modals/Vessel/ModalCreateVessel.vue";
import ModalCreateSeatmap from "../components/Modals/Vessel/Seatmap/ModalCreateSeatmap.vue";

const apiBase = import.meta.env.VITE_API_URL;
const activeTab = ref("all");
const searchQuery = ref("");
const isTableLoading = ref(false);
const isLoading = ref(false);
const vessels = ref([]);
const isSeatmapLoading = ref(false);
const isCreateModalOpen = ref(false);
const isSeatmapModalOpen = ref(false);
const seatmapVessel = ref(null);
const seatmapData = ref([]);

const status = {
  0: { label: "Pending", class: "text-yellow-600 bg-yellow-100" },
  1: { label: "Active", class: "text-green-600 bg-green-100" },
  2: { label: "Drydock", class: "text-gray-600 bg-gray-100" },
  3: { label: "Grounded", class: "text-yellow-600 bg-yellow-100" },
};

const tabs = [
  { id: "all", name: "All Vessels" },
  { id: "available", name: "Available Vessels" },
  { id: "drydock", name: "Drydock" },
  { id: "grounded", name: "Grounded" },
];

// Helpers

const statusMap = {
  available: 1,
  drydock: 2,
  grounded: 3,
};

const filteredVessels = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  let list =
    activeTab.value === "all"
      ? vessels.value
      : vessels.value.filter((v) => v.status === statusMap[activeTab.value]);

  if (!query) return list;

  return list.filter(
    (v) =>
      v.vesselName?.toLowerCase().includes(query) ||
      v.vesselId?.toString().includes(query) ||
      v.classes?.some((c) =>
        c.accommodationName?.toLowerCase().includes(query),
      ),
  );
});

const activeVesselsCount = computed(
  () => vessels.value.filter((v) => v.status === 1).length,
);

const drydockVesselsCount = computed(
  () => vessels.value.filter((v) => v.status === 2).length,
);

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
        return cls.accommodationName || "-";
    }
  });
};

// API

const fetchVessels = async () => {
  isTableLoading.value = true;
  try {
    const res = await fetch(`${apiBase}/vessels`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    if (res.ok && data.success && data.data?.vessels) {
      vessels.value = data.data.vessels.map((v) => ({
        vesselId: v.id,
        vesselName: v.vessel_name || v.name,
        status: Number(v.status),
        capacity: v.capacity,
        description: v.description,

        classes: (v.accommodations || []).map((a) => ({
          accommodationName: a.accommodation?.accommodation_name || "Unknown",
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
  } finally {
    isTableLoading.value = false;
  }
};

// const openEditModal = (vessel) => {
//   if (!vessel.classes) vessel.classes = [];
//   modals.value.createEdit.vessel = vessel;
//   modals.value.createEdit.open = true;
// };

const openSeatmapModal = async (vessel) => {
  try {
    isSeatmapLoading.value = true;
    const res = await fetch(`${apiBase}/vessels/${vessel.vesselId}/layout`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    seatmapVessel.value = vessel;
    seatmapData.value = data.classes || [];
    isSeatmapModalOpen.value = true;
  } catch (err) {
    console.error("Failed to load seatmap:", err);
    alert("Failed to load seatmap. Please try again.");
  } finally {
    isSeatmapLoading.value = false;
  }
};

const handleSeatmapSave = async (payload) => {
  if (!seatmapVessel.value) return;
  isSeatmapLoading.value = true; // add this
  try {
    const res = await fetch(
      `${apiBase}/vessels/${seatmapVessel.value.vesselId}/layout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Failed to save seatmap.");
      return;
    }

    isSeatmapModalOpen.value = false;
    fetchVessels();
  } catch (err) {
    console.error("Failed saving seatmap:", err);
    alert("Failed to save seatmap. Please try again.");
  } finally {
    isSeatmapLoading.value = false; // add this
  }
};

onMounted(() => {
  fetchVessels();
});
</script>

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
          @click="isCreateModalOpen = true"
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
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ vessels.length }}
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">Active Vessels</h3>
          <BarChart3 class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ activeVesselsCount }}
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">Drydock</h3>
          <AlertCircle class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ drydockVesselsCount }}
        </div>
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
              <tr v-if="isTableLoading">
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
                :key="vessel.vesselId"
                class="hover:bg-gray-50 align-top"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ vessel.vesselId || "-" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ vessel.vesselName || "-" }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <ul>
                    <li
                      v-for="(item, idx) in renderClassList(vessel, 'name')"
                      :key="idx"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <ul>
                    <li
                      v-for="(item, idx) in renderClassList(vessel, 'seats')"
                      :key="idx"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <ul>
                    <li
                      v-for="(item, idx) in renderClassList(vessel, 'aircon')"
                      :key="idx"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <ul>
                    <li
                      v-for="(item, idx) in renderClassList(vessel, 'wifi')"
                      :key="idx"
                    >
                      {{ item }}
                    </li>
                  </ul>
                </td>

                <td class="px-6 py-4 text-sm">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-sm font-medium',
                      status[vessel.status].class,
                    ]"
                  >
                    {{ status[vessel.status].label }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                      class="font-medium flex items-center transition-colors"
                      :class="
                        isSeatmapLoading
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:text-blue-900 cursor-pointer'
                      "
                      :disabled="isSeatmapLoading"
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
        v-if="isCreateModalOpen"
        @close="isCreateModalOpen = false"
        @save="fetchVessels"
      />
    </transition>

    <transition name="modal-fade">
      <ModalCreateSeatmap
        v-if="isSeatmapModalOpen"
        :seatmap="seatmapData"
        @save="handleSeatmapSave"
        @close="isSeatmapModalOpen = false"
      />
    </transition>
  </div>
</template>
