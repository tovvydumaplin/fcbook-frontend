<script setup>
import { Edit, Plus, Search, Trash2 } from "lucide-vue-next";
import { ref, watch, onMounted } from "vue";
import ModalCreateVehicle from "../components/ModalCreateVehicle.vue";
const isTableLoading = ref(false);
const isModalOpen = ref(false);
const vehicles = ref([]);
const apiBase = import.meta.env.VITE_API_URL;

const openCreateVehicle = () => {
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
};

const fetchVehicles = async () => {
  try {
    isTableLoading.value = true;
    const res = await fetch(`${apiBase}/vehicles`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch vehicles");
    }
    const data = await res.json();
    console.log(data);

    vehicles.value = data.data.vehicles.map((v) => ({
      id: v.vehicle_id,
      vehicleType: v.vehicle_type,
      vehicleClass: v.vehicle_class,
      updatedAt: new Date(v.updated_at).toLocaleDateString(),
    }));
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    isTableLoading.value = false;
  }
};

onMounted(async () => {
  await fetchVehicles();
});
</script>

<template>
  <div class="min-h-full bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6">
      <nav class="text-sm text-gray-500 mb-2">
        <span>Dashboard</span> <span class="mx-2">></span>
        <span class="text-gray-900">Vehicles</span>
      </nav>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold text-gray-900">
          Vehicles Management
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
    <!-- TABLE -->
    <div class="border border-gray-300 bg-white rounded-lg">
      <div
        class="px-4 py-3 border-b border-gray-200 flex justify-between items-center"
      >
        <h2 class="text-lg font-medium text-gray-900">List of Vehicles</h2>

        <!-- Search -->
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
          />
          <input
            v-model="search"
            @input="currentPage = 1"
            type="text"
            placeholder="Search"
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div class="p-4">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs text-gray-500">#</th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Vehicle Type
              </th>

              <th class="px-6 py-3 text-left text-xs text-gray-500">
                Vehicle Class
              </th>

              <th class="px-6 py-3 text-left text-xs text-gray-500">Updated</th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">User</th>
              <th class="px-6 py-3 text-left text-xs text-gray-500">Action</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading -->
            <tr v-if="isTableLoading">
              <td colspan="6" class="text-center py-6 text-gray-500">
                Loading vehicles...
              </td>
            </tr>

            <!-- Data -->
            <tr
              v-else-if="vehicles.length > 0"
              v-for="(vehicle, index) in vehicles"
              :key="vehicle.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 text-sm">
                {{ index + 1 }}
              </td>

              <td class="px-6 py-4 text-sm">
                {{ vehicle.vehicleType }}
              </td>

              <td class="px-6 py-4 text-sm">
                {{ vehicle.vehicleClass }}
              </td>

              <td class="px-6 py-4 text-sm">
                {{ vehicle.updatedAt }}
              </td>

              <td class="px-6 py-4 text-sm">-</td>

              <!-- ACTIONS -->
              <td class="px-6 py-4 text-sm flex items-start gap-1">
                <button
                  @click="handleEdit(item)"
                  class="font-medium text-blue-600 hover:text-blue-900 flex items-center"
                >
                  <Edit class="w-4 h-4 mr-1" />
                </button>

                <button
                  @click="handleDelete(item)"
                  class="font-medium text-red-600 hover:text-red-900 flex items-center"
                >
                  <Trash2 class="w-4 h-4 mr-1" />
                </button>
              </td>
            </tr>

            <!-- Empty -->
            <tr v-else>
              <td colspan="6" class="text-center py-6 text-gray-500">
                No vehicles found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <transition name="modal-fade">
    <ModalCreateVehicle
      v-if="isModalOpen"
      @close="closeModal"
      @saved="handleSaved"
    />
  </transition>
</template>
