<script setup>
import { Edit, Plus, Search } from "lucide-vue-next";
import { ref, computed, onMounted } from "vue";
import ModalCreateVehicle from "../components/Modals/Vehicle/ModalCreateVehicle.vue";
import ModalEditVehicle from "../components/Modals/Vehicle/ModalEditVehicle.vue";

const isTableLoading = ref(false);
const isEditModalOpen = ref(false);
const isCreateModalOpen = ref(false);

const vehicles = ref([]);
const search = ref("");
const activeType = ref(1);
const selectedVehicle = ref(null);
const apiBase = import.meta.env.VITE_API_URL;

const vehicleTypes = [1, 2, 3, 4, 5];

const openEditVehicle = (vehicle) => {
  selectedVehicle.value = vehicle;
  isEditModalOpen.value = true;
};

const handleCreateSaved = async () => {
  isCreateModalOpen.value = false;
  await fetchVehicles();
};

const handleEditSaved = async () => {
  isEditModalOpen.value = false;
  await fetchVehicles();
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

    if (!res.ok) throw new Error("Failed to fetch vehicles");

    const data = await res.json();

    vehicles.value = data.data.vehicles.map((v) => ({
      vehicleId: v.vehicle_id,
      vehicleType: Number(v.vehicle_type),
      vehicleClass: v.vehicle_class,
      vehicleLength: Number(v.length),
      vehicleWeight: Number(v.weight),
      updatedAt: new Date(v.updated_at).toLocaleDateString(),
    }));
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    isTableLoading.value = false;
  }
};

const filteredVehicles = computed(() => {
  return vehicles.value
    .filter((v) => v.vehicleType === activeType.value)
    .filter((v) =>
      v.vehicleClass.toLowerCase().includes(search.value.toLowerCase()),
    );
});

onMounted(fetchVehicles);
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
          @click="isCreateModalOpen = true"
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
        <!-- TABS -->
        <div class="flex gap-2 mb-4">
          <button
            v-for="type in vehicleTypes"
            :key="type"
            @click="activeType = type"
            class="px-4 py-2 rounded-md text-sm font-medium transition"
            :class="
              activeType === type
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
            "
          >
            Type {{ type }}
          </button>
        </div>
        <table class="min-w-full table-fixed divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="w-16 px-6 py-3 text-left text-xs text-gray-500">#</th>

              <th class="w-64 px-6 py-3 text-left text-xs text-gray-500">
                Vehicle Class
              </th>
              <th class="w-30 px-6 py-3 text-left text-xs text-gray-500">
                Length
              </th>
              <th class="w-30 px-6 py-3 text-left text-xs text-gray-500">
                Weight
              </th>
              <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
                Updated
              </th>
              <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
                User
              </th>
              <th class="w-40 px-6 py-3 text-left text-xs text-gray-500">
                Action
              </th>
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
              v-for="(vehicle, index) in filteredVehicles"
              :key="vehicle.vehicleId"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 text-sm">
                {{ index + 1 }}
              </td>

              <td class="px-6 py-4 text-sm">
                {{ vehicle.vehicleClass }}
              </td>

              <td class="px-6 py-4 text-sm">
                {{ vehicle.vehicleLength ? vehicle.vehicleLength + "m" : "" }}
              </td>

              <td class="px-6 py-4 text-sm">
                {{ vehicle.vehicleWeight ? vehicle.vehicleWeight + "kg" : "" }}
              </td>

              <td class="px-6 py-4 text-sm">
                {{ vehicle.updatedAt }}
              </td>

              <td class="px-6 py-4 text-sm">-</td>
              <td class="px-6 py-4 text-sm flex items-start gap-1">
                <button
                  @click="openEditVehicle(vehicle)"
                  class="font-medium text-blue-600 hover:text-blue-900 flex items-center"
                >
                  <Edit class="w-4 h-4 mr-1" />
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
      v-if="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      @save="handleCreateSaved"
    />
  </transition>
  <transition name="modal-fade">
    <ModalEditVehicle
      v-if="isEditModalOpen"
      :vehicle="selectedVehicle"
      @close="isEditModalOpen = false"
      @save="handleEditSaved"
    />
  </transition>
</template>
