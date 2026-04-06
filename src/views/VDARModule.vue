<script setup>
import { ref, onMounted } from "vue";
import { Eye, FileX, Plus, Search } from "lucide-vue-next";
import ModalCreateVDAR from "../components/Modals/VDAR/ModalCreateVDAR.vue";
import ModalCancellationReport from "../components/Modals/VDAR/ModalCancellationReport.vue";

const apiBase = import.meta.env.VITE_API_URL;
const selectedVessel = ref("");
const search = ref("");
const vessels = ref([]);
const isVesselsLoading = ref(false);
const isModalCreateVDAROpen = ref(false);
const isModalCancellationReportOpen = ref(false);

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
  } catch (err) {
    console.error(err);
  } finally {
    isVesselsLoading.value = false;
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
          <option
            v-for="vessel in vessels"
            :key="vessel.vessel_id"
            :value="vessel.vessel_id"
          >
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
              <th class="w-30 px-4 py-3 text-gray-500">Schedule</th>
              <th class="w-30 px-4 py-3 text-gray-500">
                Actual Departure Time
              </th>
              <th class="w-30 px-4 py-3 text-gray-500">Actual Arrival Time</th>
              <th class="w-40 px-4 py-3 text-gray-500">Reason of Delay</th>
              <th class="w-30 px-4 py-3 text-gray-500">Date Reported</th>
              <th class="w-20 px-4 py-3 text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-3 text-sm">~</td>
              <td class="px-4 py-3 text-sm">~</td>
              <td class="px-4 py-3 text-sm">~</td>
              <td class="px-4 py-3 text-sm">~</td>
              <td class="px-4 py-3 text-sm">~</td>
              <td class="px-4 py-3 text-sm">~</td>
              <td class="px-4 py-3 text-sm">~</td>
              <td class="px-4 py-3 text-sm">~</td>
              <td class="px-4 py-3 text-sm">~</td>
              <td class="px-4 py-3 text-sm">~</td>
              <td class="px-4 py-3 text-sm flex items-start gap-1">
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
