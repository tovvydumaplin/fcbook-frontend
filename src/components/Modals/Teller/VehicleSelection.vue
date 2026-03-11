<script setup>
import { ref, computed } from "vue";
import { X, Search } from "lucide-vue-next";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "select", "save"]);

// Vehicle type groups and brands
const vehicleGroups = [
  {
    label: "Two-Wheeled Vehicles",
    types: [
      {
        id: "motorcycle",
        label: "Motorcycle",
        brands: [
          "Yamaha",
          "Honda",
          "Suzuki",
          "Kawasaki",
          "Motorstar",
          "Rusi",
          "KTM",
          "Others",
        ],
      },
      {
        id: "mc400",
        label: "MC > 400 CC",
        brands: ["BMW", "Ducati", "Harley-Davidson", "KTM", "Others"],
      },
      {
        id: "bicycle",
        label: "Bicycle",
        brands: ["Giant", "Trek", "Specialized", "Others"],
      },
    ],
  },
  {
    label: "Light Vehicles",
    types: [
      {
        id: "tricycle",
        label: "Tricycle",
        brands: ["Honda", "Yamaha", "Suzuki", "Others"],
      },
      {
        id: "lightcar",
        label: "Light Car",
        brands: [
          "Toyota",
          "Honda",
          "Hyundai",
          "Ford",
          "Mazda",
          "Nissan",
          "Chevrolet",
          "Others",
        ],
      },
    ],
  },
  {
    label: "Medium Sized Vehicles",
    types: [
      {
        id: "van",
        label: "Van",
        brands: ["Toyota", "Nissan", "Hyundai", "Ford", "Others"],
      },
      {
        id: "pickup",
        label: "Pickup",
        brands: ["Toyota", "Ford", "Isuzu", "Nissan", "Others"],
      },
    ],
  },
];

const selectedVehicleType = ref("");
const selectedBrand = ref("");
const searchQuery = ref("");
const plateNumber = ref("");

// Get brands for selected type
const selectedTypeBrands = computed(() => {
  for (const group of vehicleGroups) {
    const type = group.types.find((t) => t.id === selectedVehicleType.value);
    if (type) return type.brands;
  }
  return [];
});

// Filter brands by search
const filteredBrands = computed(() => {
  if (!selectedTypeBrands.value.length) return [];
  return selectedTypeBrands.value.filter((brand) =>
    brand.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

// Select/deselect vehicle type
const toggleVehicleType = (typeId) => {
  if (selectedVehicleType.value === typeId) {
    selectedVehicleType.value = "";
    selectedBrand.value = "";
    plateNumber.value = "";
  } else {
    selectedVehicleType.value = typeId;
    selectedBrand.value = "";
    plateNumber.value = "";
  }
};

// Select/deselect brand
const toggleBrand = (brand) => {
  if (selectedBrand.value === brand) {
    selectedBrand.value = "";
  } else {
    selectedBrand.value = brand;
  }
};

// Confirm & Save
const confirmAndSave = () => {
  const data = {
    type: selectedVehicleType.value,
    brand: selectedBrand.value,
    plate: selectedVehicleType.value === "bicycle" ? null : plateNumber.value,
  };
  console.log("Selected Vehicle:", data);
  emit("save", data);
  emit("close");
  selectedVehicleType.value = "";
  selectedBrand.value = "";
  plateNumber.value = "";
  searchQuery.value = "";
};
</script>

<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="modal-card bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900">
            Select Vehicle Details
          </h2>
          <button
            class="h-8 w-8 p-0 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors"
            @click="emit('close')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6 space-y-6 overflow-y-scroll max-h-[80vh]">
          <!-- Search Input -->
          <div class="relative mb-4">
            <Search
              class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search vehicle requirements.."
              class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:border-transparent"
            />
          </div>

          <!-- Vehicle Type Selection -->
          <div>
            <div v-if="selectedVehicleType">
              <!-- Show only the selected group and keep the selected type highlighted -->
              <div v-for="group in vehicleGroups" :key="group.label">
                <template
                  v-if="group.types.some((t) => t.id === selectedVehicleType)"
                >
                  <div class="font-semibold text-gray-700 mb-3">
                    {{ group.label }}
                  </div>
                  <div class="grid grid-cols-3 gap-3 mb-6">
                    <!-- Vehicle Type Button -->
                    <button
                      v-for="type in group.types"
                      :key="type.id"
                      @click="toggleVehicleType(type.id)"
                      :class="[
                        'relative border rounded-lg px-4 py-6 flex flex-col items-center justify-center font-medium transition',
                        selectedVehicleType === type.id
                          ? 'btn-active'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-brand-color',
                      ]"
                    >
                      <span>{{ type.label }}</span>
                      <span class="absolute top-2 right-2 w-4.5 h-4.5">
                        <span
                          class="w-full h-full border rounded-full flex items-center justify-center"
                          :class="
                            selectedVehicleType === type.id
                              ? 'border-brand-color bg-brand-color'
                              : 'border-gray-300 bg-white'
                          "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="3"
                            v-if="selectedVehicleType === type.id"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>
                </template>
              </div>
            </div>
            <div v-else>
              <!-- Show all groups if nothing is selected -->
              <div
                v-for="group in vehicleGroups"
                :key="group.label"
                class="mb-6"
              >
                <div class="font-semibold text-gray-700 mb-3">
                  {{ group.label }}
                </div>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    v-for="type in group.types"
                    :key="type.id"
                    @click="toggleVehicleType(type.id)"
                    :class="[
                      'relative border rounded-lg px-4 py-6 flex flex-col items-center justify-center font-medium transition',
                      selectedVehicleType === type.id
                        ? 'btn-active'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-brand-color',
                    ]"
                  >
                    <span>{{ type.label }}</span>
                    <span class="absolute top-2 right-2">
                      <span
                        class="inline-block w-4 h-4 border rounded-full"
                        :class="
                          selectedVehicleType === type.id
                            ? 'border-brand-color bg-brand-color'
                            : 'border-gray-300 bg-white'
                        "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="white"
                          stroke-width="3"
                          v-if="selectedVehicleType === type.id"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="3"
                          v-if="selectedVehicleType === type.id"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Brand Selection (only if a type is selected and has brands) -->
          <div v-if="selectedTypeBrands.length" class="space-y-2">
            <div class="font-semibold text-gray-700 mb-3">Brand of Vehicle</div>
            <div class="grid grid-cols-4 gap-2">
              <button
                v-for="brand in filteredBrands"
                :key="brand"
                @click="toggleBrand(brand)"
                :class="[
                  'px-4 py-6 rounded-lg font-medium transition flex items-center justify-center relative',
                  selectedBrand === brand
                    ? 'btn-active'
                    : ' text-gray-700 border border-gray-200 hover:border-brand-color',
                ]"
              >
                <span>{{ brand }}</span>

                <!-- Circle with check -->
                <span
                  class="flex items-center justify-center w-4 h-4 border rounded-full ml-2 transition-colors absolute top-2 right-2"
                  :class="
                    selectedBrand === brand
                      ? 'border-brand-color bg-brand-color'
                      : 'border-gray-300 bg-white'
                  "
                >
                  <svg
                    v-if="selectedBrand === brand"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              </button>
            </div>

            <!-- Plate Number Input (hide if bicycle) -->
            <div v-if="selectedVehicleType !== 'bicycle'" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-3"
                >Plate Number</label
              >
              <input
                v-model="plateNumber"
                type="text"
                placeholder="Enter plate number"
                class="w-full px-4 py-4 border border-gray-300 rounded-lg"
              />
            </div>

            <!-- Confirm & Save Button -->
            <button
              class="mt-4 px-6 py-3 rounded-lg bg__brand__color text-white font-semibold w-full transition hover:bg-brand-color-blue cursor-pointer"
              :disabled="
                !selectedBrand ||
                (selectedVehicleType !== 'bicycle' && !plateNumber)
              "
              @click="confirmAndSave"
            >
              Confirm & Save
            </button>

            <!-- Back button to reselect vehicle type -->
            <button
              class="mt-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium w-full"
              @click="toggleVehicleType(selectedVehicleType)"
            >
              Back to Vehicle Type
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
