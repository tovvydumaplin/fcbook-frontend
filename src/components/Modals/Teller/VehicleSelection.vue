<script setup>
import { ref, computed, watch } from "vue";
import { X, Search } from "lucide-vue-next";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  routeId: {
    type: Number,
    default: null,
  },
});

const emit = defineEmits(["close", "select", "save"]);

const apiBase = import.meta.env.VITE_API_URL;

const vehicles = ref([]);
const vehicleRates = ref([]);
const selectedVehicle = ref(null);
const plateNumber = ref("");
const searchQuery = ref("");
const isLoading = ref(false);
const activeTab = ref(1); // Active vehicle type tab

// Get unique vehicle types from data
const vehicleTypes = computed(() => {
  const types = [...new Set(vehicles.value.map((v) => v.vehicle_type))].sort(
    (a, b) => a - b,
  );
  return types;
});

// Get vehicles for active tab with rates
const vehiclesForActiveType = computed(() => {
  const vehiclesInType = vehicles.value.filter((v) => v.vehicle_type === activeTab.value);
  
  // Merge with rates
  return vehiclesInType.map((vehicle) => {
    const rateInfo = vehicleRates.value.find(
      (r) => r.vehicle_id === vehicle.vehicle_id
    );
    const rate = rateInfo?.vehicle_rate;
    return {
      ...vehicle,
      rate: rate !== null && rate !== undefined ? parseFloat(rate) : null,
    };
  });
});

// Filter vehicles by search for active type
const filteredVehicles = computed(() => {
  if (!searchQuery.value) return vehiclesForActiveType.value;

  const query = searchQuery.value.toLowerCase();
  return vehiclesForActiveType.value.filter((v) =>
    v.vehicle_class.toLowerCase().includes(query),
  );
});

// Filter brands by search on step 2
const filteredBrands = computed(() => {
  if (!searchQuery.value) return commonBrands;
  const query = searchQuery.value.toLowerCase();
  return commonBrands.filter((brand) => brand.toLowerCase().includes(query));
});

// Check if bicycle (no plate needed)
const isBicycle = computed(() => {
  return selectedVehicle.value?.vehicle_class.toLowerCase().includes("bicycle");
});

// Fetch vehicles from API
const fetchVehicles = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem("token");
    const authHeader = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const response = await fetch(`${apiBase}/vehicles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Vehicles Response:", result);

      if (result.success && result.data?.vehicles) {
        vehicles.value = result.data.vehicles;
      }
    } else {
      console.error("Failed to fetch vehicles:", response.status);
    }
  } catch (err) {
    console.error("Error fetching vehicles:", err);
  } finally {
    isLoading.value = false;
  }
};

// Fetch vehicle rates for the selected route
const fetchVehicleRates = async () => {
  if (!props.routeId) {
    vehicleRates.value = [];
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const authHeader = token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const response = await fetch(`${apiBase}/vehicle-rates/route/${props.routeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Vehicle Rates Response:", result);

      if (result.success && result.data?.vehicleRates) {
        vehicleRates.value = result.data.vehicleRates.map((rate) => ({
          vehicle_id: rate.vehicle?.vehicle_id,
          vehicle_rate: rate.vehicle_rate,
        }));
      }
    } else {
      console.error("Failed to fetch vehicle rates:", response.status);
    }
  } catch (err) {
    console.error("Error fetching vehicle rates:", err);
  }
};

// Select vehicle class
const selectVehicle = (vehicle) => {
  selectedVehicle.value = vehicle;
};

// Confirm & Save
const confirmAndSave = () => {
  if (!selectedVehicle.value) return;
  if (!isBicycle.value && !plateNumber.value) {
    alert("Please enter a plate number");
    return;
  }

  const data = {
    vehicle_id: selectedVehicle.value.vehicle_id,
    vehicle_class: selectedVehicle.value.vehicle_class,
    vehicle_type: selectedVehicle.value.vehicle_type,
    plate_number: plateNumber.value,
    rate: selectedVehicle.value.rate || 0,
  };
  console.log("Selected Vehicle:", data);
  emit("save", data);
  closeModal();
};

// Close modal
const closeModal = () => {
  emit("close");
  activeTab.value = 1;
  selectedVehicle.value = null;
  plateNumber.value = "";
  searchQuery.value = "";
};

// Watch for modal open and fetch data
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      if (vehicles.value.length === 0) {
        await fetchVehicles();
      }
      await fetchVehicleRates();
      
      // Set active tab to first available type
      if (vehicleTypes.value.length > 0) {
        activeTab.value = vehicleTypes.value[0];
      }
    }
  },
);

// Watch for tab changes and reset search
watch(activeTab, () => {
  searchQuery.value = "";
});
</script>

<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="modal-card bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">
              Select Vehicle Class
            </h2>
            <p
              v-if="selectedVehicle"
              class="text-sm text-blue-600 mt-1 font-medium"
            >
              Selected: {{ selectedVehicle.vehicle_class }}
            </p>
          </div>
          <button
            class="h-8 w-8 p-0 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors"
            @click="closeModal"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Vehicle Class Selection -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Search -->
          <div class="p-6 border-b">
            <div class="relative">
              <Search
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search vehicle class..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto">
            <!-- Loading State -->
            <div
              v-if="isLoading"
              class="flex justify-center items-center py-12"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
                ></div>
                <span class="text-gray-600 font-medium"
                  >Loading vehicles...</span
                >
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-else-if="vehicleTypes.length === 0"
              class="text-center py-12 text-gray-500"
            >
              <p class="text-lg font-medium">No vehicles found</p>
              <p class="text-sm mt-1">No vehicles available</p>
            </div>

            <!-- Tabbed Interface -->
            <div v-else>
              <!-- Type Tabs -->
              <div class="px-6 pt-4 pb-2 border-b bg-gray-50">
                <div class="flex gap-2">
                  <button
                    v-for="type in vehicleTypes"
                    :key="type"
                    @click="activeTab = type"
                    :class="[
                      'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200',
                      activeTab === type
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300',
                    ]"
                  >
                    Type {{ type }}
                  </button>
                </div>
              </div>

              <!-- Vehicle List for Active Type -->
              <div class="p-6">
                <!-- Empty State for filtered results -->
                <div
                  v-if="filteredVehicles.length === 0"
                  class="text-center py-12 text-gray-500"
                >
                  <p class="text-lg font-medium">No vehicles found</p>
                  <p class="text-sm mt-1">Try a different search term</p>
                </div>

                <!-- Vehicle Grid -->
                <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <button
                    v-for="vehicle in filteredVehicles"
                    :key="vehicle.vehicle_id"
                    @click="selectVehicle(vehicle)"
                    :class="[
                      'relative p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center group',
                      selectedVehicle?.vehicle_id === vehicle.vehicle_id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-400 hover:shadow-md',
                    ]"
                  >
                    <!-- Vehicle Icon -->
                    <div
                      :class="[
                        'w-12 h-12 rounded-lg flex items-center justify-center transition-colors',
                        selectedVehicle?.vehicle_id === vehicle.vehicle_id
                          ? 'bg-blue-100'
                          : 'bg-gray-100 group-hover:bg-blue-50',
                      ]"
                    >
                      <svg
                        :class="[
                          'w-6 h-6 transition-colors',
                          selectedVehicle?.vehicle_id === vehicle.vehicle_id
                            ? 'text-blue-600'
                            : 'text-gray-600 group-hover:text-blue-600',
                        ]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <span
                      :class="[
                        'text-sm font-medium',
                        selectedVehicle?.vehicle_id === vehicle.vehicle_id
                          ? 'text-blue-900'
                          : 'text-gray-900',
                      ]"
                    >
                      {{ vehicle.vehicle_class }}
                    </span>
                    <span
                      v-if="vehicle.rate !== null && vehicle.rate !== undefined"
                      :class="[
                        'text-xs font-semibold',
                        selectedVehicle?.vehicle_id === vehicle.vehicle_id
                          ? 'text-blue-600'
                          : 'text-gray-600',
                      ]"
                    >
                      ₱{{ parseFloat(vehicle.rate).toFixed(2) }}
                    </span>
                    <span
                      v-else
                      class="text-xs text-red-500 font-medium"
                    >
                      No rate set
                    </span>

                    <!-- Selected Indicator -->
                    <div
                      v-if="selectedVehicle?.vehicle_id === vehicle.vehicle_id"
                      class="absolute top-2 right-2 bg-blue-600 rounded-full p-1"
                    >
                      <svg
                        class="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Plate Number Input (shown when vehicle is selected) -->
        <div v-if="selectedVehicle && !isBicycle" class="px-6 pb-4 border-b bg-gray-50">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Plate Number <span class="text-red-500">*</span>
          </label>
          <input
            v-model="plateNumber"
            type="text"
            placeholder="Enter plate number (e.g., ABC 1234)"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            @input="plateNumber = plateNumber.toUpperCase()"
          />
        </div>

        <!-- Footer -->
        <div class="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="confirmAndSave"
            :disabled="!selectedVehicle || (!isBicycle && !plateNumber)"
            :class="[
              'px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2',
              selectedVehicle && (isBicycle || plateNumber)
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-card {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
