<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { Eye, FileX, Plus, Search } from "lucide-vue-next";
import ModalCreateVDAR from "../components/Modals/VDAR/ModalCreateVDAR.vue";
import ModalCancellationReport from "../components/Modals/VDAR/ModalCancellationReport.vue";

const apiBase = import.meta.env.VITE_API_URL;
const selectedVessel = ref("");
const search = ref("");
const vessels = ref([]);
const vdars = ref([]);
const isVesselsLoading = ref(false);
const isVdarsLoading = ref(false);
const isModalCreateVDAROpen = ref(false);
const isModalCancellationReportOpen = ref(false);

const filteredVdars = computed(() => {
  if (!search.value) return vdars.value;
  const q = search.value.toLowerCase();
  return vdars.value.filter((v) => {
    const master =
      `${v.vessel_master.first_name} ${v.vessel_master.last_name}`.toLowerCase();
    return (
      String(v.voyage_number).includes(q) ||
      master.includes(q) ||
      (v.reason_of_delay || "").toLowerCase().includes(q)
    );
  });
});

const fetchVessels = async () => {
  isVesselsLoading.value = true;
  try {
    const res = await fetch(`${apiBase}/vessels`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch vessels");

    const data = await res.json();
    vessels.value = data.data.vessels;
    console.log("Fetched vessels:", vessels.value);
  } catch (err) {
    console.error(err);
  } finally {
    isVesselsLoading.value = false;
  }
};

const fetchVdars = async (vesselId) => {
  isVdarsLoading.value = true;
  vdars.value = [];
  try {
    const res = await fetch(`${apiBase}/vessels/${vesselId}/vdars`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch VDARs");

    const data = await res.json();
    vdars.value = data.data.vdars;
    console.log("Fetched VDARs:", vdars.value);
  } catch (err) {
    console.error(err);
  } finally {
    isVdarsLoading.value = false;
  }
};

watch(selectedVessel, (id) => {
  console.log("selectedVessel changed:", id);
  if (id) fetchVdars(id);
});

const formatTime = (time) => {
  if (!time) return "—";
  const [h, m] = time.split(":");
  const date = new Date();
  date.setHours(+h, +m);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
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
        <span>Dashboard</span> <span class="mx-2">></span>
        <span class="text-gray-900">VDAR</span>
      </nav>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">
          Vessel Daily Activity Report
        </h1>
      </div>
    </div>

    <!-- Vessel Dropdown -->
    <div class="mb-4 flex justify-between">
      <div>
        <select
          v-model="selectedVessel"
          :disabled="isVesselsLoading"
          class="border bg-white border-gray-300 text-gray-800 rounded-md px-3 py-2 disabled:bg-white disabled:cursor-not-allowed"
        >
          <option value="" disabled>
            {{ isVesselsLoading ? " Loading vessels..." : "Select Vessel" }}
          </option>
          <option v-for="vessel in vessels" :key="vessel.id" :value="vessel.id">
            {{ vessel.vessel_name }}
          </option>
        </select>
      </div>
      <div class="flex gap-6">
        <div>
          <button
            @click="isModalCreateVDAROpen = true"
            type="button"
            class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
          >
            <Plus class="w-4 h-4" />
            Create Report
          </button>
        </div>
        <div>
          <button
            @click="isModalCancellationReportOpen = true"
            type="button"
            class="bg-white text-red-500 border border-red-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
          >
            <FileX class="w-4 h-4" />
            Cancellation Report
          </button>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div class="border border-gray-300 bg-white rounded-lg">
      <div
        class="px-4 py-3 border-b border-gray-200 flex justify-between items-center"
      >
        <h2 class="text-lg font-medium text-gray-900">List of Reports</h2>
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
          />
          <input
            v-model="search"
            type="text"
            placeholder="Search"
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="p-4">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 text-left text-xs">
            <tr>
              <th class="w-20 px-4 py-3 text-gray-500">Voyage #</th>
              <th class="w-40 px-4 py-3 text-gray-500">Vessel Master</th>
              <th class="w-20 px-4 py-3 text-gray-500">Sailing Spd.</th>
              <th class="w-20 px-4 py-3 text-gray-500">Fuel ROB(KL)</th>
              <th class="w-20 px-4 py-3 text-gray-500">Water (Tons)</th>
              <th class="w-40 px-4 py-3 text-gray-500">Schedule</th>
              <th class="w-30 px-4 py-3 text-gray-500">
                Actual Departure Time
              </th>
              <th class="w-30 px-4 py-3 text-gray-500">Actual Arrival Time</th>
              <th class="w-40 px-4 py-3 text-gray-500">Reason of Delay</th>
              <th class="w-25 px-4 py-3 text-gray-500">Date Reported</th>
              <th class="w-20 px-4 py-3 text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- No vessel selected -->
            <tr v-if="!selectedVessel">
              <td
                colspan="11"
                class="px-4 py-10 text-center text-sm text-gray-400"
              >
                Select a vessel to view its reports.
              </td>
            </tr>
            <!-- Loading -->
            <tr v-else-if="isVdarsLoading">
              <td
                colspan="11"
                class="px-4 py-10 text-center text-sm text-gray-400"
              >
                Loading reports...
              </td>
            </tr>
            <!-- No results -->
            <tr v-else-if="filteredVdars.length === 0">
              <td
                colspan="11"
                class="px-4 py-10 text-center text-sm text-gray-400"
              >
                No reports found.
              </td>
            </tr>
            <!-- Data rows -->
            <tr
              v-for="vdar in filteredVdars"
              :key="vdar.id"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-3 text-sm">{{ vdar.voyage_number }}</td>
              <td class="px-4 py-3 text-sm">
                {{ vdar.vessel_master.first_name }}
                {{ vdar.vessel_master.last_name }}
              </td>
              <td class="px-4 py-3 text-sm">
                {{ vdar.recorded_sailing_speed }}
              </td>
              <td class="px-4 py-3 text-sm">{{ vdar.fuel_rob }}</td>
              <td class="px-4 py-3 text-sm">{{ vdar.water_consumption }}</td>
              <td class="px-4 py-3 text-sm">
                {{ formatTime(vdar.schedule.departure_time) }} →
                {{ formatTime(vdar.schedule.arrival_time) }}
              </td>
              <td class="px-4 py-3 text-sm">
                {{ formatTime(vdar.actual_departure_time) }}
              </td>
              <td class="px-4 py-3 text-sm">
                {{ formatTime(vdar.actual_arrival_time) }}
              </td>
              <td class="px-4 py-3 text-sm">
                {{ vdar.reason_of_delay || "—" }}
              </td>
              <td class="px-4 py-3 text-sm">
                {{ formatDate(vdar.created_at) }}
              </td>
              <td class="px-4 py-3 text-sm">
                <button
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
    <ModalCreateVDAR
      v-if="isModalCreateVDAROpen"
      @close="isModalCreateVDAROpen = false"
      @save="handleCreateSaved"
    />
  </transition>
  <transition name="modal-fade">
    <ModalCancellationReport
      v-if="isModalCancellationReportOpen"
      @close="isModalCancellationReportOpen = false"
      @save="handleCreateSaved"
    />
  </transition>
</template>
