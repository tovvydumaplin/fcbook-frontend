<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <nav class="text-sm text-gray-500 mb-2">
        <span>Dashboard</span>
        <span class="mx-2">></span>
        <span class="text-gray-900">Ports</span>
      </nav>
      <h1 class="text-2xl font-semibold text-gray-900">Port Management</h1>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Total Ports Card -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">Total Ports</h3>
          <button
            @click="isModalOpen = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus class="w-4 h-4" />
            Create
          </button>
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ totalPorts }}
        </div>
        <p class="text-sm text-gray-500">
          {{ closedPorts }} closed ports as of today
        </p>
      </div>

      <!-- Closed Ports Card -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">Closed Ports</h3>
          <BarChart3 class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ closedPorts }}
        </div>
        <p class="text-sm text-gray-500">Across all available ports</p>
      </div>

      <!-- Zero-Transaction Ports Card -->
      <div class="bg-white rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">
            Zero-Transaction Ports
          </h3>
          <AlertCircle class="w-5 h-5 text-blue-600" />
        </div>
        <div class="text-3xl font-bold text-gray-900 mb-1">
          {{ zeroTransactionPorts }}
        </div>
        <p class="text-sm text-gray-500">
          Total of active ports without transaction
        </p>
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

      <!-- List of Ports Section -->
      <div class="p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-medium text-gray-900">List of Ports</h2>
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

        <!-- Data Table -->
        <div class="overflow-x-auto">
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
                  Port Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Corridor
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Facilities
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Updated by
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created at
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last updated
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
                v-for="port in filteredPorts"
                :key="port.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ port.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ port.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ port.corridor }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ port.facilities }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ port.updatedBy }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(port.status)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  >
                    {{ port.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ port.createdAt }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ port.lastUpdated }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    :class="
                      port.status === 'Available'
                        ? 'text-blue-600 hover:text-blue-900'
                        : 'text-blue-600 hover:text-blue-900'
                    "
                    class="font-medium"
                    @click="handleAction(port)"
                  >
                    {{ port.status === "Available" ? "View" : "Open" }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <ModalCreatePort
      v-if="isModalOpen"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Plus, BarChart3, AlertCircle, Search } from "lucide-vue-next";
import ModalCreatePort from "@/components/ModalCreatePort.vue";

const activeTab = ref("all");
const searchQuery = ref("");
const isModalOpen = ref(false);

const tabs = [
  { id: "all", name: "All Ports" },
  { id: "active", name: "Active Ports" },
  { id: "closed", name: "Closed Ports" },
];

const ports = ref([
  {
    id: 1,
    name: "Batangas Port",
    corridor: "Western",
    facilities: "Ramp",
    updatedBy: "Tovvy B. Dumaplin",
    status: "Available",
    createdAt: "2025-05-02 9:24",
    lastUpdated: "2025-08-02 9:24",
  },
  {
    id: 2,
    name: "Calapan Port",
    corridor: "Western",
    facilities: "Ramp",
    updatedBy: "Tovvy B. Dumaplin",
    status: "Online",
    createdAt: "2025-05-02 9:24",
    lastUpdated: "2025-08-02 9:24",
  },
]);

const totalPorts = computed(() => ports.value.length);
const closedPorts = computed(
  () => ports.value.filter((port) => port.status === "Offline").length
);
const zeroTransactionPorts = ref(0);

const filteredPorts = computed(() => {
  let filtered = ports.value;

  if (activeTab.value === "active") {
    filtered = filtered.filter((port) => port.status !== "Offline");
  } else if (activeTab.value === "closed") {
    filtered = filtered.filter((port) => port.status === "Offline");
  }

  if (searchQuery.value) {
    filtered = filtered.filter(
      (port) =>
        port.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        port.corridor.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        port.updatedBy.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered;
});

const getStatusClass = (status) => {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-800";
    case "Online":
      return "bg-green-100 text-green-800";
    case "Offline":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const handleAction = (port) => {
  console.log(
    `${port.status === "Available" ? "Viewing" : "Opening"} port:`,
    port.name
  );
};

const handleSave = (newPort) => {
  ports.value.unshift(newPort);
  isModalOpen.value = false;
};
</script>
