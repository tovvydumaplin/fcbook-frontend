<script setup>
import { Edit } from "lucide-vue-next";
import { ref, watch } from "vue";
import ModalEditVehicleRate from "../../../components/Modals/Vehicle/VehicleRate/ModalEditVehicleRate.vue";

const apiBase = import.meta.env.VITE_API_URL;

const isEditModalOpen = ref(false);

const selectedVehicleRate = ref(null);
const vehicles = ref([]);
const isRateLoading = ref(false);

const emit = defineEmits(["edit", "saved"]);

const props = defineProps({
  selectedRoute: Object,
  isRateLoading: Boolean,
});

const openEditVehicleRate = (vehicle) => {
  selectedVehicleRate.value = vehicle;
  isEditModalOpen.value = true;
};

const saveEditVehicleRate = async () => {
  isEditModalOpen.value = false;
  await fetchRouteVehicleRates();
};

const fetchRouteVehicleRates = async (routeId) => {
  try {
    isRateLoading.value = true;

    const res = await fetch(`${apiBase}/vehicle-rates/route/${routeId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch vehicle rates");

    const data = await res.json();

    vehicles.value = data.data.vehicleRates.map((vehicle) => ({
      vehicleRateId: vehicle.vehicle_rate_id,
      vehicleType: vehicle.vehicle?.vehicle_type,
      vehicleClass: vehicle.vehicle?.vehicle_class,
      vehicleRate: vehicle.vehicle_rate,
      status: vehicle.status,
      updatedAt: vehicle.updated_at
        ? new Date(vehicle.updated_at).toLocaleDateString()
        : null,
    }));
  } catch (err) {
    console.error(err);
  } finally {
    isRateLoading.value = false;
  }
};

watch(
  () => props.selectedRoute,
  (newRoute) => {
    if (newRoute) {
      fetchRouteVehicleRates(newRoute.id);
    } else {
      vehicles.value = [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <!-- LOADING -->
  <div v-if="isRateLoading" class="flex justify-center items-center py-10">
    <div
      class="flex items-center gap-3 bg-white border border-blue-600 shadow-lg px-5 py-3 rounded-lg"
    >
      <span
        class="w-6 h-6 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
      ></span>
      <span class="font-semibold text-blue-700 text-base"
        >Loading Vehicles Rates...</span
      >
    </div>
  </div>

  <!-- NO SELECTION -->
  <div v-else-if="!selectedRoute" class="text-gray-500 text-center py-10">
    Select a route to view details.
  </div>

  <!-- TABLE -->
  <div v-else class="overflow-auto max-h-[400px]">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            #
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Type Number
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Type Class
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Vehicle Rate
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Updated
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            User
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Status
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="(vehicle, index) in vehicles"
          :key="vehicle.vehicleRateId"
          class="hover:bg-gray-50"
        >
          <td class="px-6 py-4 text-sm">{{ index + 1 }}</td>
          <td class="px-6 py-4 text-sm">{{ vehicle.vehicleType }}</td>
          <td class="px-6 py-4 text-sm">{{ vehicle.vehicleClass }}</td>
          <td class="px-6 py-4 text-sm">
            <span v-if="vehicle.vehicleRate === null">—</span>
            <span v-else>₱{{ vehicle.vehicleRate }}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-500">
            <span v-if="vehicle.updatedAt === null">—</span>
            <span v-else>{{ vehicle.updatedAt }}</span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-500">—</td>
          <td class="px-6 py-4 text-sm text-gray-500">
            <span v-if="vehicle.status === null">—</span>
            <span v-else>{{ vehicle.status }}</span>
          </td>
          <td class="px-6 py-4 text-sm">
            <button
              @click="openEditVehicleRate(vehicle)"
              class="font-medium text-blue-600 hover:text-blue-900 flex items-center"
            >
              <Edit class="w-4 h-4 mr-1" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <transition name="modal-fade">
    <ModalEditVehicleRate
      v-if="isEditModalOpen"
      :vehicle="selectedVehicleRate"
      @close="isEditModalOpen = false"
      @save="saveEditVehicleRate"
    />
  </transition>
</template>
